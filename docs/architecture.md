# StudyHub — Architecture & System Design Documentation

## 1. System Overview

StudyHub is a production-grade SaaS Learning Management Platform (LMS) designed for engineering education. It is architected as an npm-based monorepo with 4 isolated applications and 7 shared packages:

```
STUDYHUB MONOREPO
├── apps/
│   ├── web/          # Next.js 15+ Public Marketing Website + Student Learning Portal
│   ├── admin/        # Next.js 15+ Administrative Backoffice & Course Builder
│   ├── api/          # Express + Node.js Business Backend & Persistence Orchestration
│   └── worker/       # BullMQ Background Job Worker (Certificates, Emails, Analytics)
│
└── packages/
    ├── database/     # Prisma ORM 7 + PostgreSQL schemas and client
    ├── validation/   # Zod shared schemas for contracts & request validation
    ├── types/        # TypeScript domain contracts and interfaces
    ├── logger/       # Structured Pino logging wrapper
    ├── config/       # Environment parsing & runtime configuration
    ├── tsconfig/     # Reusable TypeScript configurations
    └── eslint-config/# Centralized linting rules
```

---

## 2. High-Level Data Flow

```
                      ┌──────────────────────┐
                      │    Marketing Web     │
                      │  (/courses, preview) │
                      └──────────┬───────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │  Student Login / OTP │
                      └──────────┬───────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │ Checkout & Payment   │
                      └──────────┬───────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │ Payment Gateway      │
                      │ (Stripe / Razorpay)  │
                      └──────────┬───────────┘
                                 │ Webhook (Signature verified)
                                 ▼
                      ┌──────────────────────┐
                      │ Express API (v1)     │
                      │ Order -> PAID        │
                      │ Create Enrollment    │
                      └──────────┬───────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                                         ▼
   ┌─────────────────┐                       ┌─────────────────┐
   │ PostgreSQL      │                       │ Redis / BullMQ  │
   │ State Storage   │                       │ Async Jobs      │
   └────────┬────────┘                       └────────┬────────┘
            │                                         │
            ▼                                         ▼
   ┌─────────────────┐                       ┌─────────────────┐
   │ Student Learns  │                       │ Worker Service  │
   │ Course Player   │                       │ - PDF Certificate│
   │ Mark Complete   │                       │ - Transactional │
   │ 100% Progress   │──────────────────────►│   Emails        │
   └─────────────────┘                       │ - Notifications │
                                             └─────────────────┘
```

---

## 3. Application Responsibilities & Boundaries

### 3.1 Web (`apps/web`)

- **Public Marketing**: Hero, Course discovery, Category filtering, Instructor showcases.
- **Project-First Course Details**: Architecture breakdown, tech stack grid, module curriculum with free preview lessons.
- **Student LMS Portal**: Dashboard overview, continue learning card, dual-pane course player (video, article, quiz), progress tracking, certificate showcase.
- **Boundary**: No direct database access; communicates exclusively through typed API client with `@studyhub/api`.

### 3.2 Admin (`apps/admin`)

- **Operations & RBAC**: User directory, custom roles, permission matrix.
- **Course Builder**: Multi-step builder for modules, lessons, video uploads, free-preview toggles, and drip schedules.
- **Operations**: Student enrollments, order & payment reconciliation, coupon management, review moderation, business analytics.

### 3.3 API (`apps/api`)

- **Business Logic & Rules Engine**: Domain feature modules (`auth`, `courses`, `lessons`, `enrollments`, `orders`, `payments`, `reviews`, `certificates`).
- **Payment Verification**: Idempotent webhook handling with signature verification.
- **Permission Enforcement**: Granular RBAC (`requirePermission('course:update')`).

### 3.4 Worker (`apps/worker`)

- **Non-blocking Background Processing**:
  - `generate-certificate`: Renders high-resolution PDF certificate with cryptographic verification code and QR code.
  - `send-email`: Transactional receipts, welcome messages, password reset OTPs.
  - `send-notification`: Real-time websocket broadcasts and in-app alerts.

### 3.5 Database (`packages/database`)

- Canonical Prisma schema defining models: `User`, `Role`, `Course`, `Module`, `Lesson`, `Enrollment`, `Progress`, `Order`, `Payment`, `Certificate`, `Coupon`, `Review`.
