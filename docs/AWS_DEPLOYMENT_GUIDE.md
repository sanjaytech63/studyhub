# AWS Production Deployment Guide for StudyHub

**Domain:** `studyhubonline.store`  
**Architecture:** Option 1 (Subdomain Routing)

- **Web App:** `https://studyhubonline.store` & `https://www.studyhubonline.store`
- **Admin App:** `https://admin.studyhubonline.store`
- **API Backend:** `https://api.studyhubonline.store`
- **Database:** AWS RDS PostgreSQL (`studyhub-prod-db` in `ap-south-1`)

---

## 1. AWS RDS Security Group Configuration

Ensure your EC2 server can communicate with your PostgreSQL RDS database:

1. Open **AWS RDS Console** in **Asia Pacific (Mumbai) `ap-south-1`**.
2. Click **Databases** → **`studyhub-prod-db`**.
3. Under **Connectivity & security**, note your **Endpoint** (e.g. `studyhub-prod-db.xxxx.ap-south-1.rds.amazonaws.com`).
4. Click on the attached Security Group `default (sg-0ef77fb4a0998ff9a)`.
5. Under the **Inbound rules** tab, click **Edit inbound rules**:
   - **Type**: `PostgreSQL` (Port `5432`)
   - **Source**: Select the security group of your new EC2 instance (or your EC2's private/elastic IP).
6. Click **Save rules**.

---

## 2. Launching the EC2 Server

1. Open **EC2 Console** in **ap-south-1 (Mumbai)**.
2. Click **Launch instances**:
   - **Name**: `studyhub-production`
   - **AMI**: **Ubuntu Server 24.04 LTS (HVM)**, 64-bit (x86_64).
   - **Instance Type**: `t3.medium` (2 vCPU, 4GB RAM) or `t3.small` (minimum 2GB RAM).
   - **Key pair**: Select or create an SSH `.pem` key pair.
   - **Network settings**:
     - **VPC**: Choose `vpc-080ee16ec1b11057e` (the same VPC as your RDS).
     - **Auto-assign public IP**: `Enable`.
     - **Firewall (Security group)**:
       - Allow **SSH (22)** from your IP.
       - Allow **HTTP (80)** from Anywhere (`0.0.0.0/0`).
       - Allow **HTTPS (443)** from Anywhere (`0.0.0.0/0`).
   - **Storage**: At least **25 GiB gp3**.
3. Click **Launch instance**.
4. Go to **EC2** → **Network & Security** → **Elastic IPs**:
   - Click **Allocate Elastic IP address**.
   - Select the allocated IP, click **Actions** → **Associate Elastic IP address**, and attach it to your new EC2 instance.

---

## 3. DNS Configuration (Domain Registrar / Route 53)

Add these **A records** pointing to your EC2 **Elastic IP**:

| Type  | Name / Subdomain | Value (Target)    | TTL |
| :---- | :--------------- | :---------------- | :-- |
| **A** | `@` (root)       | `YOUR_ELASTIC_IP` | 300 |
| **A** | `www`            | `YOUR_ELASTIC_IP` | 300 |
| **A** | `admin`          | `YOUR_ELASTIC_IP` | 300 |
| **A** | `api`            | `YOUR_ELASTIC_IP` | 300 |

---

## 4. EC2 Provisioning Commands

Connect to your EC2 via SSH:

```bash
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

### 4.1. Install Docker, Git, and Nginx

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw nginx certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker
```

### 4.2. Clone the Repository & Configure Environment

```bash
git clone https://github.com/your-username/studyhub.git
cd studyhub

# Copy production environment file
cp .env.production.example .env.production
nano .env.production
```

_Fill in your real secrets, RDS endpoint, and database password in `.env.production`._

### 4.3. Run Database Migrations

```bash
# Run Prisma migrations to set up the tables on your RDS Postgres
docker run --rm \
  --network host \
  -v $(pwd):/app -w /app node:24-alpine \
  sh -c "npm ci && DATABASE_URL='postgresql://studyhub_admin:PASSWORD@ENDPOINT:5432/studyhub?schema=public' npm run db:deploy --workspace=@studyhub/database"
```

### 4.4. Start Services with Docker Compose

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Verify containers are healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

---

## 5. Nginx Reverse Proxy & SSL Setup

### 5.1. Copy Nginx Configuration

```bash
sudo cp infrastructure/nginx/studyhub.conf /etc/nginx/sites-available/studyhub.conf
sudo ln -s /etc/nginx/sites-available/studyhub.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t

# Restart Nginx
sudo systemctl reload nginx
```

### 5.2. Issue SSL Certificate via Let's Encrypt (Certbot)

```bash
sudo certbot --nginx -d studyhubonline.store -d www.studyhubonline.store -d admin.studyhubonline.store -d api.studyhubonline.store
```

_Enter your email address and agree to the Terms of Service. Certbot automatically configures HTTPS and sets up auto-renewal._

---

## 6. Verification Checklist

- [ ] Web App: `https://studyhubonline.store`
- [ ] Admin App: `https://admin.studyhubonline.store`
- [ ] API Health Check: `https://api.studyhubonline.store/api/v1/health`
