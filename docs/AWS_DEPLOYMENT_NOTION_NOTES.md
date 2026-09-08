# 📘 StudyHub AWS Production & CI/CD Master Runbook

> **Status:** 🟢 **Production Live & SSL Secured**  
> **Project:** StudyHub Monorepo (`web`, `admin`, `api`, `worker`)  
> **Primary Domain:** [https://studyhubonline.store](https://studyhubonline.store)  
> **AWS Region:** `ap-south-1` (Asia Pacific - Mumbai)  
> **Elastic IP:** `15.206.223.108`  
> **Database:** AWS RDS PostgreSQL (`studyhub-prod-db`)  
> **Last Updated:** September 8, 2026  
> **Author:** Sanjay & DeepMind Antigravity

---

## 📌 1. Production Architecture Overview

StudyHub runs on AWS using a **Single-Server High-Density Docker Architecture** with an isolated AWS RDS PostgreSQL database and automated GitHub Actions CI/CD:

```
[ Internet User / Browser ]
             │
      HTTPS (Port 443)
             ▼
   [ Elastic IP: 15.206.223.108 ]
             │
    [ Nginx Reverse Proxy + Let's Encrypt SSL ]
    ├── studyhubonline.store / www  ──> 127.0.0.1:3000 (studyhub-web Next.js)
    ├── admin.studyhubonline.store ──> 127.0.0.1:3001 (studyhub-admin Next.js)
    └── api.studyhubonline.store   ──> 127.0.0.1:5000 (studyhub-api Express)
             │
    [ Internal Docker Network: studyhub-network ]
    ├── studyhub-redis  (Port 6379)
    ├── studyhub-worker (Background Jobs / BullMQ)
             │
      VPC Security Group Inbound Rule (Port 5432 with SSL)
             ▼
    [ AWS RDS PostgreSQL: studyhub-prod-db:5432 ]
```

---

## 🛠️ 2. Cloud & Infrastructure Inventory

| Resource                | Identifier / Value                | Details & Configuration                                                |
| :---------------------- | :-------------------------------- | :--------------------------------------------------------------------- |
| **AWS VPC**             | `vpc-080ee16ec1b11057e`           | CIDR: `10.0.0.0/16` (`studyhub-prod`)                                  |
| **EC2 Server**          | `i-0ccd30b73fe597ae7`             | Ubuntu 24.04 LTS (`t3.medium`, 30 GB gp3)                              |
| **Server Elastic IP**   | `15.206.223.108`                  | Static public IPv4 attached to EC2                                     |
| **Private IP**          | `10.0.87.55`                      | Subnet `studyhub-private-2b`                                           |
| **Route Table**         | `rtb-032c88d4d3472f501`           | `studyhub-public-rt` (`0.0.0.0/0` -> Internet Gateway)                 |
| **EC2 Security Group**  | `sg-006dabca578c89482`            | Inbound: 22 (SSH), 80 (HTTP), 443 (HTTPS)                              |
| **RDS PostgreSQL**      | `studyhub-prod-db`                | Endpoint: `studyhub-prod-db.cngoksag0z0e.ap-south-1.rds.amazonaws.com` |
| **RDS Port & DB**       | Port `5432` / Database `studyhub` | PostgreSQL 18.3, Master User: `studyhub_admin`                         |
| **RDS Security Group**  | `sg-0ef77fb4a0998ff9a`            | Inbound: Port 5432 from `10.0.0.0/16` (VPC CIDR)                       |
| **Redis Cache**         | `studyhub-redis`                  | Docker Redis 7 with AOF persistence                                    |
| **Memory Optimization** | 4GB Swap Space                    | `/swapfile` active to prevent OOM build crashes                        |

---

## 🌐 3. GoDaddy DNS Configuration

| Type  | Host / Name | Points To (Elastic IP) | TTL      | Purpose                                             | Status  |
| :---- | :---------- | :--------------------- | :------- | :-------------------------------------------------- | :------ |
| **A** | `@`         | `15.206.223.108`       | 1/2 Hour | Root domain `https://studyhubonline.store`          | ✅ Live |
| **A** | `www`       | `15.206.223.108`       | 1/2 Hour | Redirect / WWW alias                                | ✅ Live |
| **A** | `admin`     | `15.206.223.108`       | 1/2 Hour | Admin Portal `https://admin.studyhubonline.store`   | ✅ Live |
| **A** | `api`       | `15.206.223.108`       | 1/2 Hour | Backend REST API `https://api.studyhubonline.store` | ✅ Live |

---

## 🔄 4. Local vs. Production Environment Comparison

| Configuration           | Local Development (`.env`)                  | Production EC2 (`.env.production`)              |
| :---------------------- | :------------------------------------------ | :---------------------------------------------- |
| **`NODE_ENV`**          | `development`                               | `production`                                    |
| **Web App URL**         | `http://localhost:3000`                     | `https://studyhubonline.store`                  |
| **Admin Portal URL**    | `http://localhost:3001`                     | `https://admin.studyhubonline.store`            |
| **API Base URL**        | `http://localhost:5000/api/v1`              | `https://api.studyhubonline.store/api/v1`       |
| **PostgreSQL Database** | `localhost:5432/studyhub` _(no SSL needed)_ | AWS RDS PostgreSQL _(automatic SSL encryption)_ |
| **Redis Cache**         | `redis://localhost:6379`                    | `redis://redis:6379` _(Docker service name)_    |

---

## ⚡ 5. Database & Migration Commands Cheat Sheet

Convenience scripts are configured in the root `package.json` so you never have to remember long workspace commands:

| Action                           | Local Development (VS Code Terminal)           | Production (EC2 / CI-CD)                                                |
| :------------------------------- | :--------------------------------------------- | :---------------------------------------------------------------------- |
| **Generate Prisma Client**       | `npm run db:generate`                          | Automatically executed inside Docker build                              |
| **Create New Migration**         | `npm run db:migrate` _(prompts for name)_      | Not run on prod (migrations are created locally)                        |
| **Deploy Pending Migrations**    | `npm run db:deploy`                            | Automatically run by GitHub Actions CI/CD!                              |
| **Database GUI (Prisma Studio)** | `npm run db:studio` _(opens `localhost:5555`)_ | N/A (local development only)                                            |
| **Seed Roles & Admin User**      | `npm run seed:admin`                           | `docker compose -f docker-compose.prod.yml exec api npm run seed:admin` |

---

## 🚀 6. Automated GitHub Actions CI/CD Pipeline

You **never need to SSH manually** to deploy code! The deployment pipeline is located at `.github/workflows/deploy-ec2.yml`.

### One-Time Setup: Add 3 Secrets in GitHub

In GitHub $\to$ **`sanjaytech63/studyhub`** $\to$ **Settings** $\to$ **Secrets and variables** $\to$ **Actions** $\to$ **New repository secret**:

| Secret Name       | Value                                                           |
| :---------------- | :-------------------------------------------------------------- |
| **`EC2_HOST`**    | `15.206.223.108`                                                |
| **`EC2_USER`**    | `ubuntu`                                                        |
| **`EC2_SSH_KEY`** | Entire contents of `C:\Users\Sanjay\Downloads\studyhub-key.pem` |

### The Professional Branching Strategy (Git Flow)

**Rule: Never push directly to `main`!**

```
[ Your Local VS Code ]
       │
1. Create Branch: `git checkout -b feature/my-feature`
2. Code & Commit: `git commit -m "feat: add new feature"`
3. Push Branch: `git push -u origin feature/my-feature`
       │
[ GitHub Pull Request ]
       │
4. Open PR to `main` -> GitHub CI validates format, lint & typecheck
5. Click "Merge pull request"
       │
[ Automated GitHub Actions CD ]
       │
6. GitHub connects to EC2 via SSH
7. Runs `git pull origin main`
8. Applies pending Prisma migrations to RDS PostgreSQL
9. Rebuilds and restarts updated Docker containers
10. Prunes old Docker cache -> Live in seconds!
```

---

## 🐛 7. Complete Troubleshooting Log & Fixes Applied

### 1. SSH Port 22 Connection Timed Out

- **Cause:** EC2 was in private route table routed only to a NAT Gateway.
- **Fix:** Associated `studyhub-private-2b` with `studyhub-public-rt` (Internet Gateway).

### 2. Next.js Monorepo Standalone Output

- **Cause:** Next.js didn't emit standalone output folders.
- **Fix:** Added `output: 'standalone'` in `apps/web/next.config.ts` and `apps/admin/next.config.ts`.

### 3. SSH Connection Reset & OOM During Docker Builds

- **Cause:** Compiling Next.js 16 across multiple containers simultaneously consumed 100% CPU and physical RAM.
- **Fix:** Created a 4GB persistent Swap file (`/swapfile`), added `-o ServerAliveInterval=60` to SSH, and built containers sequentially.

### 4. Admin Docker Build Missing `public/` Directory

- **Cause:** `apps/admin` lacked static assets, breaking the Dockerfile `COPY` step.
- **Fix:** Added `RUN mkdir -p apps/admin/public` and added `.gitkeep`.

### 5. Prisma 7 Build-Time Generate Failure

- **Cause:** Prisma 7 requires `DATABASE_URL` during client generation.
- **Fix:** Passed dummy build-time variable: `DATABASE_URL="postgresql://build:build@localhost:5432/build" npm run db:generate`.

### 6. Node 24 ESM Module Resolution (API & Worker)

- **Cause:** Node 24 ESM strictly enforces `.js` extensions on compiled relative imports.
- **Fix:** Configured `Dockerfile.api` and `Dockerfile.worker` to launch via `npx tsx --tsconfig ...`.

### 7. Missing `package.json` in API Runtime Container

- **Cause:** Runtime stage omitted root `package.json`, causing npm workspace commands to fail.
- **Fix:** Added `COPY --from=build /app/package.json /app/package-lock.json ./` to both Dockerfiles.

### 8. RDS PostgreSQL Port 5432 Inbound Rule

- **Cause:** RDS Security Group only allowed traffic from itself, blocking EC2 (`10.0.87.55`).
- **Fix:** Added an Inbound Rule to `sg-0ef77fb4a0998ff9a` for PostgreSQL port 5432 from `10.0.0.0/16` (VPC CIDR).

### 9. Route Prefix Mismatch (`/auth/login` vs `/api/v1/auth/login`)

- **Cause:** Frontend sent requests to `/auth/login` while backend was mounted under `/api/v1/auth/login`.
- **Fix:** Mounted routes at both `/api/v1` and root `/` in Express API, and normalized client config URLs to guarantee `/api/v1`.

### 10. `no pg_hba.conf entry ... no encryption` (SSL Error)

- **Cause:** AWS RDS PostgreSQL strictly enforces SSL/TLS encryption. Node-postgres tried unencrypted connections.
- **Fix:** Enabled automatic SSL (`ssl: { rejectUnauthorized: false }`) in `packages/database/src/client.ts` for RDS and production connections.

### 11. Missing `User.avatarUrl` Column

- **Cause:** `avatarUrl` existed in `schema.prisma` but had no migration generated.
- **Fix:** Created migration `20260824000000_add_avatar_url` and added safe check to `seed-admin-user.ts`.

### 12. Missing `STUDENT` Role & Admin 403 Forbidden Errors

- **Cause:** Database was completely unseeded; `STUDENT` role was missing (breaking signup) and `ADMIN` role had no `RolePermission` entries (breaking admin pages with 403).
- **Fix:** Enhanced `scripts/seed-admin-user.ts` to bootstrap all 3 roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`), all 26 permissions, and grant full RBAC privileges to `ADMIN`.

### 13. Email / OTP Not Received (Registration & Forgot Password)

- **Cause:**
  1. `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASSWORD` were empty in `.env.production` (no mail server was configured).
  2. `resendEmailVerificationOtp` in `auth.service.ts` generated OTPs in the DB but was missing the call to dispatch the email.
  3. `sendMail` had no safety check or fallback, so invalid or missing SMTP settings caused requests to fail or hang.
- **Fix:**
  1. Updated `mail.service.ts` and `mail.client.ts` with resilience: if SMTP is not configured, it logs the simulated email and raw OTP directly to Docker/console logs (`docker logs studyhub-api`) so development and testing are never blocked.
  2. Added missing `sendEmailVerificationOtpEmail` dispatch in `resendEmailVerificationOtp`.
  3. Wrapped email dispatches in try-catch blocks to prevent email delivery errors from breaking account creation.
  4. Added `Enter OTP & Reset Password` direct navigation button on the forgot password page.
  5. Created `scripts/test-email.ts` (`npm run test:email`) for one-command SMTP diagnostics and testing.

---

## 📧 8. How to Configure SMTP for Real Email / OTP Delivery

To receive real OTP emails in user inboxes (for Registration, Forgot Password, and Email Change), configure your SMTP provider:

### Option A: Free Gmail SMTP (Fastest — 2 Minutes)

1. Go to your **Google Account** $\to$ **Security** $\to$ **2-Step Verification**.
2. Scroll to the bottom and click **App passwords**.
3. Create a new app password named `StudyHub`.
4. Copy the generated 16-character code (e.g. `abcd efgh ijkl mnop`).
5. In `.env.production` on EC2 (or `.env` locally), configure:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=abcdefghijklmnop
   SMTP_FROM="StudyHub <your-email@gmail.com>"
   SMTP_SECURE=false
   ```

### Option B: AWS SES (Mumbai ap-south-1)

1. In AWS Console $\to$ **Amazon SES** $\to$ **SMTP Settings** $\to$ **Create SMTP Credentials**.
2. Verify your domain `studyhubonline.store` or sender email in SES.
3. In `.env.production`, configure:
   ```env
   SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=<SES_SMTP_USERNAME>
   SMTP_PASSWORD=<SES_SMTP_PASSWORD>
   SMTP_FROM="StudyHub <no-reply@studyhubonline.store>"
   SMTP_SECURE=false
   ```

### Test Email Command:

```bash
# Locally
npm run test:email your-email@gmail.com

# On EC2 Production Container
docker compose -f docker-compose.prod.yml exec api npm run test:email your-email@gmail.com
```

---

## 🎯 9. Verified Live Production Endpoints

- 🌐 **Web Application:** [https://studyhubonline.store](https://studyhubonline.store)
- 🛡️ **Admin Portal:** [https://admin.studyhubonline.store](https://admin.studyhubonline.store)
- ⚡ **Backend API Health:** [https://api.studyhubonline.store/api/v1/health/ready](https://api.studyhubonline.store/api/v1/health/ready)
