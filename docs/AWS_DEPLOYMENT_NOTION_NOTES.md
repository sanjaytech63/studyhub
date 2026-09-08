# 📘 StudyHub AWS Production Deployment — Notion Notes

> **Status:** 🟡 In Progress / Active Deployment  
> **Project:** StudyHub Monorepo (`web`, `admin`, `api`, `worker`)  
> **Primary Domain:** `studyhubonline.store`  
> **AWS Region:** `ap-south-1` (Asia Pacific - Mumbai)  
> **Server Elastic IP:** `15.206.223.108`  
> **Last Updated:** September 8, 2026

---

## 📌 Executive Summary & Architecture

Deploying the **StudyHub** monorepo using **Subdomain Architecture (Option 1)**:

- 🌐 **Web App:** `https://studyhubonline.store` & `https://www.studyhubonline.store` (Next.js 16, Port 3000)
- 🛡️ **Admin Portal:** `https://admin.studyhubonline.store` (Next.js 16, Port 3001)
- ⚡ **Backend API:** `https://api.studyhubonline.store` (Express / Node.js 24, Port 5000)
- 🗄️ **Database:** AWS RDS PostgreSQL (`studyhub-prod-db` in Mumbai `ap-south-1`)
- 🚀 **Cache / Queues:** Upstash Redis (or Dockerized Redis)
- 🔄 **Reverse Proxy:** Nginx with Let's Encrypt Wildcard / Multi-domain SSL (Certbot)

---

## 🛠️ Infrastructure Inventory

| Resource               | Identifier / Value                                           | Notes                                      |
| :--------------------- | :----------------------------------------------------------- | :----------------------------------------- |
| **VPC**                | `vpc-080ee16ec1b11057e`                                      | `studyhub-prod` VPC                        |
| **EC2 Instance**       | `i-0ccd30b73fe597ae7`                                        | Ubuntu 24.04 LTS (`t3.medium`, 30 GB gp3)  |
| **Elastic Public IP**  | `15.206.223.108`                                             | Static public IPv4 attached to EC2         |
| **Private IP**         | `10.0.87.55`                                                 | Subnet `studyhub-private-2b`               |
| **Public Route Table** | `rtb-032c88d4d3472f501`                                      | `studyhub-public-rt` (has IGW `0.0.0.0/0`) |
| **RDS Endpoint**       | `studyhub-prod-db.cngoksag0z0e.ap-south-1.rds.amazonaws.com` | PostgreSQL 18.3, Port 5432                 |
| **RDS Username**       | `studyhub_admin`                                             | Master database user                       |
| **Security Group**     | `sg-006dabca578c89482`                                       | `studyhub-web-sg` (Ports 22, 80, 443 open) |

---

## 🌐 DNS Setup (GoDaddy)

Add 4 `A` records pointing to your Elastic IP **`15.206.223.108`**:

| Type | Name / Host | Target Value     | TTL      | Status                                   |
| :--- | :---------- | :--------------- | :------- | :--------------------------------------- |
| `A`  | `@`         | `15.206.223.108` | 1/2 Hour | ✅ Configured                            |
| `A`  | `www`       | `15.206.223.108` | 1/2 Hour | ✅ Configured (Deleted old Vercel CNAME) |
| `A`  | `admin`     | `15.206.223.108` | 1/2 Hour | ✅ Configured                            |
| `A`  | `api`       | `15.206.223.108` | 1/2 Hour | ✅ Configured                            |

---

## 🐛 Issues Encountered & Solutions Applied

### Issue 1: SSH Port 22 Connection Timed Out

> **Symptom:** `ssh: connect to host 15.206.223.108 port 22: Connection timed out`  
> **Root Cause:** The EC2 instance was launched inside `studyhub-private-2b` (`10.0.80.0/20`), which was routed only to a NAT Gateway (`studyhub-private-rt`). Instances in private route tables cannot receive inbound traffic from the internet, even with an Elastic IP.  
> **Fix:** In **VPC** → **Route Tables** → **`studyhub-public-rt` (`rtb-032c88d4d3472f501`)** → **Edit Subnet Associations** → checked `studyhub-private-2b`. This instantly granted the instance direct Internet Gateway access.

### Issue 2: Next.js Standalone Build in Monorepo

> **Root Cause:** Next.js production Docker builds fail without `.next/standalone`.  
> **Fix:** Added `output: 'standalone'` to both `apps/web/next.config.ts` and `apps/admin/next.config.ts`. Created `Dockerfile.admin` and configured build arguments for client-side environment variables.

### Issue 3: SSH Client Disconnect during Heavy Docker Pulls

> **Symptom:** `client_loop: send disconnect: Connection reset`  
> **Fix:** Added keep-alive flags to SSH command: `-o ServerAliveInterval=60`. Switched to running database migrations directly inside the built API container rather than running a heavy standalone temporary container.

---

## 📋 Step-by-Step Deployment Runbook

### Step 1: Connect to Server via SSH

```powershell
ssh -o ServerAliveInterval=60 -i "C:\Users\Sanjay\Downloads\studyhub-key.pem" ubuntu@15.206.223.108
```

### Step 2: Write Production Environment (`.env.production`)

Run this single-line command inside `~/studyhub` (Base64-encoded to prevent terminal truncation):

```bash
echo "Tk9ERV9FTlY9cHJvZHVjdGlvbgpBUElfVVJMPWh0dHBzOi8vYXBpLnN0dWR5aHVib25saW5lLnN0b3JlCkFQSV9QUkVGSVg9L2FwaS92MQpXRUJfVVJMPWh0dHBzOi8vc3R1ZHlodWJvbmxpbmUuc3RvcmUKQURNSU5fVVJMPWh0dHBzOi8vYWRtaW4uc3R1ZHlodWJvbmxpbmUuc3RvcmUKTkVYVF9QVUJMSUNfQVBQX1VSTD1odHRwczovL3N0dWR5aHVib25saW5lLnN0b3JlCk5FWFRfUFVCTElDX0FQSV9VUkw9aHR0cHM6Ly9hcGkuc3R1ZHlodWJvbmxpbmUuc3RvcmUKTkVYVF9QVUJMSUNfQVBQX05BTUU9U3R1ZHlIdWIKUE9SVD01MDAwCkxPR19MRVZFTD1pbmZvCkRBVEFCQVNFX1VSTD1wb3N0Z3Jlc3FsOi8vc3R1ZHlodWJfYWRtaW46U3R1ZHlIdWIyMDI2JTIxUGFzc0BzdHVkeWh1Yi1wcm9kLWRiLmNuZ29rc2FnMHowZS5hcC1zb3V0aC0xLnJkcy5hbWF6b25hd3MuY29tOjU0MzIvc3R1ZHlodWI/c2NoZW1hPXB1YmxpYwpSRURJU19VUkw9cmVkaXNzOi8vZGVmYXVsdDpnUUFBQUFBQUFiNm9BQUlnY0RFMlpURTBaVE00T1dNMFlUZzBOVE5sT1dNek9XUTBNRGcwT0dZM1pUVTNOUUBtYWpvci1oYXdrLTExNDM0NC51cHN0YXNoLmlvOjYzNzkKSldUX0FDQ0VTU19TRUNSRVQ9YThmNGM5YjJlMWQwNDczODU2MjkxYTBjN2U1ZjNiMmQxODQ5NjczMDJjNWU3MTgyOTRhNmI1YzNkMmUxZjBhOQpKV1RfUkVGUkVTSF9TRUNSRVQ9N2UxYjljM2Q1YTBmMjg0NjEwNzM4NTkyYzRlNmExYjhkMmYwMzk0ODU3NjFhMmIzYzRkNWU2ZjdhOGI5YzBkMQpKV1RfQUNDRVNTX0VYUElSRVNfSU49MTVtCkpXVF9SRUZSRVNIX0VYUElSRVNfSU49N2QKT1RQX0VYUElSRVNfSU49MzAwClNNVFBfSE9TVD1zYW5kYm94LnNtdHAubWFpbHRyYXAuaW8KU01UUF9QT1JUPTI1MjUKU01UUF9VU0VSPTZjNDU5YzZhOTFiNDhjClNNVFBfUEFTU1dPUkQ9ZjAzNDZiNjVhYmNhYzkKU01UUF9GUk9NPSJTdHVkeUh1YiA8bm8tcmVwbHlAc3R1ZHlodWJvbmxpbmUuc3RvcmU+IgpTTVRQX1NFQ1VSRT1mYWxzZQpDTE9VRElOQVJZX0NMT1VEX05BTUU9c2d4aTFicHYKQ0xPVURJTkFSWV9BUElfS0VZPTc0MzY1NDY5NzgyOTk5NApDTE9VRElOQVJZX0FQSV9TRUNSRVQ9RjB3b3R0TFFwVzJPX2pqZFB3MFdUU2lKRHhjCkFXU19SRUdJT049YXAtc291dGgtMQpDT1JTX09SSUdJTj1odHRwczovL3N0dWR5aHVib25saW5lLnN0b3JlLGh0dHBzOi8vd3d3LnN0dWR5aHVib25saW5lLnN0b3JlLGh0dHBzOi8vYWRtaW4uc3R1ZHlodWJvbmxpbmUuc3RvcmUK" | base64 -d > ~/studyhub/.env.production
```

### Step 3: Build & Launch Docker Containers

```bash
cd ~/studyhub
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 4: Run Database Migrations

```bash
docker compose -f docker-compose.prod.yml exec api npm run db:deploy --workspace=@studyhub/database
```

### Step 5: Configure Nginx & Activate SSL

```bash
sudo cp infrastructure/nginx/studyhub.conf /etc/nginx/sites-available/studyhub.conf
sudo ln -s /etc/nginx/sites-available/studyhub.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Issue Let's Encrypt SSL certificates
sudo certbot --nginx -d studyhubonline.store -d www.studyhubonline.store -d admin.studyhubonline.store -d api.studyhubonline.store
```

---

## 🎯 Verification Matrix

- [ ] **Web Application:** `https://studyhubonline.store`
- [ ] **Admin Portal:** `https://admin.studyhubonline.store`
- [ ] **API Health Endpoint:** `https://api.studyhubonline.store/api/v1/health`
- [ ] **Database Connection:** Verified through API health check (`database: "connected"`)
- [ ] **SSL Certificates:** A-grade rating with automatic 90-day renewal via systemd certbot timer
