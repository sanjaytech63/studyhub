# StudyHub Decoupled AWS Production Architecture Guide

**Domain:** `studyhubonline.store`  
**Region:** Asia Pacific (Mumbai) `ap-south-1`  
**Database:** RDS PostgreSQL (`studyhub-prod-db` in `vpc-080ee16ec1b11057e`)

---

## 1. Architecture Overview

| Component                         | Service                       | Domain / URL                                                         |
| :-------------------------------- | :---------------------------- | :------------------------------------------------------------------- |
| **Web Frontend** (`apps/web`)     | AWS Amplify Hosting (SSR)     | `https://studyhubonline.store`<br>`https://www.studyhubonline.store` |
| **Admin Frontend** (`apps/admin`) | AWS Amplify Hosting (SSR)     | `https://admin.studyhubonline.store`                                 |
| **Backend API** (`apps/api`)      | AWS ECS Fargate + ALB         | `https://api.studyhubonline.store`                                   |
| **Database**                      | AWS RDS PostgreSQL (Existing) | `studyhub-prod-db.xxxx.ap-south-1.rds.amazonaws.com`                 |
| **Cache & BullMQ**                | AWS ElastiCache Redis         | Private VPC Cluster                                                  |
| **File Storage**                  | AWS S3 Bucket                 | `studyhub-prod-media-uploads`                                        |
| **SSL & DNS**                     | Route 53 + ACM                | Free wildcard certificate `*.studyhubonline.store`                   |

---

## 2. Phase 1: Data & Networking Setup (VPC & ElastiCache)

Your database **`studyhub-prod-db`** is already running inside `vpc-080ee16ec1b11057e`.

### 2.1. Create ElastiCache (Redis) Cluster

1. Open **Amazon ElastiCache Console** in `ap-south-1`.
2. Click **Create Redis OSS cache**:
   - **Cluster mode**: Disabled (Standalone or Cluster enabled based on traffic).
   - **Node type**: `cache.t4g.micro` (or `cache.t4g.small`).
   - **VPC**: Select `vpc-080ee16ec1b11057e`.
   - **Security Group**: Create `studyhub-redis-sg` allowing Inbound TCP `6379` from the ECS security group.
3. Save the Primary Endpoint (e.g. `studyhub-redis.xxxx.ap-south-1.cache.amazonaws.com:6379`).

### 2.2. Store Secrets in AWS Secrets Manager

Go to **AWS Secrets Manager** → **Store a new secret**:

- **Secret 1**: `studyhub/production/database-url`
  - Value: `postgresql://studyhub_admin:<PASSWORD>@<RDS_ENDPOINT>:5432/studyhub?schema=public`
- **Secret 2**: `studyhub/production/redis-url`
  - Value: `redis://<ELASTICACHE_ENDPOINT>:6379`
- **Secret 3**: `studyhub/production/jwt`
  - Keys: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

---

## 3. Phase 2: Deploying Backend API to AWS ECS Fargate

### 3.1. Create ECR Repository

1. Go to **Amazon ECR** → **Create repository**.
2. Name: `studyhub-api` (Visibility: Private).

### 3.2. Create Application Load Balancer (ALB)

1. Go to **EC2 Console** → **Load Balancers** → **Create Application Load Balancer**:
   - **Name**: `studyhub-api-alb`
   - **Scheme**: Internet-facing
   - **VPC**: `vpc-080ee16ec1b11057e` (Select public subnets across 2 AZs).
   - **Security Group**: Allow Inbound port `443` (HTTPS) and `80` (HTTP) from `0.0.0.0/0`.
2. **Target Group**:
   - **Target type**: IP addresses (required for Fargate).
   - **Protocol**: HTTP, Port: `5000`.
   - **Health check path**: `/api/v1/health`.
3. **Listener**:
   - Add HTTPS (`443`) with ACM certificate for `api.studyhubonline.store`.

### 3.3. Create ECS Cluster and Service

1. Go to **Amazon ECS** → **Clusters** → **Create cluster**:
   - Name: `studyhub-production-cluster`
   - Infrastructure: **AWS Fargate (serverless)**.
2. Register the Task Definition from `infrastructure/ecs/task-definition.json`.
3. Create the Service:
   - Name: `studyhub-api-service`
   - Desired tasks: `2` (for high availability).
   - Attach to Target Group created with the ALB.

---

## 4. Phase 3: Deploying Frontends (`apps/web` & `apps/admin`) to AWS Amplify

AWS Amplify natively handles Next.js SSR, image optimization, edge routing, and automatic CI/CD.

### 4.1. Deploy Web (`studyhubonline.store`)

1. Go to **AWS Amplify Console** → **Create new app** → **Host web app**.
2. Connect your **GitHub repository** and select branch `main`.
3. In **App settings**:
   - **App name**: `studyhub-web`
   - **Monorepo configuration**: Tick **"My repository is a monorepo"** → Select `apps/web`.
4. Amplify will automatically detect the configuration from `amplify.yml`.
5. Under **Environment variables**, set:
   - `NEXT_PUBLIC_API_URL` = `https://api.studyhubonline.store`
   - `NEXT_PUBLIC_APP_URL` = `https://studyhubonline.store`
   - `NEXT_PUBLIC_APP_NAME` = `StudyHub`
6. Click **Save and deploy**.

### 4.2. Deploy Admin (`admin.studyhubonline.store`)

1. In Amplify Console, click **Host another app** or add another app targeting `apps/admin`.
2. Select branch `main`.
3. Environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.studyhubonline.store`
   - `NEXT_PUBLIC_APP_URL` = `https://admin.studyhubonline.store`
   - `NEXT_PUBLIC_APP_NAME` = `StudyHub Admin`
4. Click **Save and deploy**.

---

## 5. Phase 4: Route 53 & Custom Domains

1. Go to **AWS Route 53** → **Hosted zones** → `studyhubonline.store`.
2. **Web Domain**:
   - In Amplify Console (`studyhub-web`) → **Domain management** → Add domain `studyhubonline.store` and `www.studyhubonline.store`. Amplify will automatically provision SSL certificates.
3. **Admin Domain**:
   - In Amplify Console (`studyhub-admin`) → **Domain management** → Add subdomain `admin.studyhubonline.store`.
4. **API Domain**:
   - In Route 53, create an **A record**:
     - Name: `api` (`api.studyhubonline.store`)
     - Alias: **Yes**
     - Route traffic to: **Alias to Application and Classic Load Balancer** → Choose your region (`ap-south-1`) → Select `studyhub-api-alb`.

---

## 6. Phase 5: CI/CD Pipeline

The project now includes:

- [amplify.yml](file:///c:/Users/Sanjay/Desktop/studyhub/amplify.yml) for automated frontend builds on every commit.
- [.github/workflows/deploy-api-ecs.yml](file:///c:/Users/Sanjay/Desktop/studyhub/.github/workflows/deploy-api-ecs.yml) for building the API Docker image, pushing to Amazon ECR, and triggering zero-downtime rolling deployments on ECS Fargate.
