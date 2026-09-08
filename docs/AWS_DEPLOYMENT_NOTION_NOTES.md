# 📘 StudyHub AWS Production Deployment — Notion Runbook

> **Status:** 🟢 **Production Live & Verified (SSL Active)**  
> **Project:** StudyHub Monorepo (`web`, `admin`, `api`, `worker`)  
> **Primary Domain:** [studyhubonline.store](https://studyhubonline.store)  
> **AWS Region:** `ap-south-1` (Asia Pacific - Mumbai)  
> **Elastic IP:** `15.206.223.108`  
> **Date:** September 8, 2026  
> **Author:** Sanjay & DeepMind Antigravity

---

## 📌 1. Architecture Overview

StudyHub is deployed on AWS using a **Single-Server High-Density Docker Architecture** with an isolated AWS RDS PostgreSQL database:

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
      VPC Peering / Security Group Rule
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
| **RDS Security Group**  | `sg-0ef77fb4a0998ff9a`            | Inbound: Port 5432 from `10.0.0.0/16` (VPC)                            |
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

## 🐛 4. Problems Encountered & Solutions Applied

### Issue 1: SSH Port 22 Connection Timed Out

- **Symptom:** `ssh: connect to host 15.206.223.108 port 22: Connection timed out`
- **Root Cause:** The EC2 was launched in subnet `studyhub-private-2b`, which was associated with `studyhub-private-rt` pointing only to a NAT Gateway. Private route tables cannot receive incoming internet traffic.
- **Solution:** Re-associated `studyhub-private-2b` with `studyhub-public-rt` (`rtb-032c88d4d3472f501`) which routes directly to the AWS Internet Gateway.

### Issue 2: SSH Disconnections & Memory Exhaustion During Builds

- **Symptom:** `client_loop: send disconnect: Connection reset` and build freezes during Next.js and Prisma compilations.
- **Root Cause:** Compiling Next.js 16 across multiple containers simultaneously consumed 100% CPU and exhausted the 4GB RAM of the instance.
- **Solution:**
  1. Created a 4GB persistent swap file: `sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`.
  2. Added SSH keep-alive flag: `ssh -o ServerAliveInterval=60 ...`.
  3. Built images sequentially rather than all at once.

### Issue 3: Next.js Missing Standalone Output

- **Symptom:** Docker container build couldn't locate `.next/standalone`.
- **Root Cause:** Next.js in a monorepo doesn't emit standalone output by default.
- **Solution:** Added `output: 'standalone'` to `apps/web/next.config.ts` and `apps/admin/next.config.ts`.

### Issue 4: Admin Docker Build Missing `public/` Folder

- **Symptom:** `COPY --from=build /app/apps/admin/public ./apps/admin/public` returned `failed: not found`.
- **Root Cause:** `apps/admin` did not have static assets and thus had no `public` directory created in git.
- **Solution:** Added `RUN mkdir -p apps/admin/public` inside `Dockerfile.admin` and added `apps/admin/public/.gitkeep`.

### Issue 5: Prisma 7 Build-Time Generate Failure

- **Symptom:** `prisma generate` failed in Docker build with `Cannot resolve environment variable: DATABASE_URL`.
- **Root Cause:** Prisma 7 requires `DATABASE_URL` even during client generation.
- **Solution:** Passed a dummy build-time connection string: `DATABASE_URL="postgresql://build:build@localhost:5432/build" npm run db:generate`.

### Issue 6: Node 24 ESM Module Resolution Error

- **Symptom:** `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@/utils'` and `Cannot find module '/app/apps/worker/dist/config/logger'`.
- **Root Cause:** Node 24 strictly enforces ESM file extensions (`.js`) on compiled outputs and ignores TypeScript path aliases at runtime.
- **Solution:** Configured `Dockerfile.api` and `Dockerfile.worker` to launch via `npx tsx --tsconfig ...`, allowing native TypeScript and ESM path resolution in production.

### Issue 7: Missing `package.json` in API Runtime Container

- **Symptom:** `npm error enoent Could not read package.json: no such file or directory, open '/app/package.json'`.
- **Root Cause:** Runtime stage only copied subpackages and omitted `/app/package.json`, preventing npm workspaces from executing.
- **Solution:** Added `COPY --from=build /app/package.json /app/package-lock.json ./` to `Dockerfile.api` and `Dockerfile.worker`.

### Issue 8: RDS PostgreSQL Port 5432 Connection Timed Out

- **Symptom:** `Error: P1001: Can't reach database server at studyhub-prod-db...:5432`.
- **Root Cause:** The RDS Security Group (`sg-0ef77fb4a0998ff9a`) only allowed incoming traffic from itself. Traffic from the EC2 instance's security group was blocked by AWS.
- **Solution:** Added an Inbound Rule to `sg-0ef77fb4a0998ff9a` for **Type: PostgreSQL (5432)** with **Source: `10.0.0.0/16`** (the VPC CIDR). Database migrations immediately succeeded.

---

## 🚀 5. Daily Server Management Runbook

### Connecting to the Server

```powershell
ssh -o ServerAliveInterval=60 -i "C:\Users\Sanjay\Downloads\studyhub-key.pem" ubuntu@15.206.223.108
```

### Checking Status of All Services

```bash
cd ~/studyhub
docker compose -f docker-compose.prod.yml ps
```

### Viewing Real-Time Logs

```bash
# View API logs
docker logs -f studyhub-api

# View Worker logs
docker logs -f studyhub-worker

# View Web logs
docker logs -f studyhub-web

# View Admin logs
docker logs -f studyhub-admin
```

### Applying Future Database Migrations

```bash
docker compose -f docker-compose.prod.yml exec -w /app/packages/database api npx prisma migrate deploy --config prisma.config.ts
```

### Pulling Updates & Rebuilding (CI/CD Workflow)

```bash
cd ~/studyhub
git pull origin main

# Rebuild specific updated service (e.g. web):
docker compose -f docker-compose.prod.yml up -d --build web

# Or rebuild API:
docker compose -f docker-compose.prod.yml up -d --build api
```

### Nginx & SSL Certificate Management

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Certificates auto-renew via Certbot systemd timer:
sudo certbot renew --dry-run
```

---

## 🎯 6. Verified Live Endpoints

- 🌐 **Web Application:** [https://studyhubonline.store](https://studyhubonline.store)
- 🛡️ **Admin Portal:** [https://admin.studyhubonline.store](https://admin.studyhubonline.store)
- ⚡ **API Readiness (DB Connected):** [https://api.studyhubonline.store/api/v1/health/ready](https://api.studyhubonline.store/api/v1/health/ready)
- 💓 **API Liveness Probe:** [https://api.studyhubonline.store/api/v1/health/live](https://api.studyhubonline.store/api/v1/health/live)
