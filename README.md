# Mira

Mira is a college payments and partner payout platform built for hackathon submission. It lets student-facing payment forms initiate Nomba checkout links, routes payments through configured partner sub-accounts, records payment history in PostgreSQL, and exposes an admin portal for partner onboarding, balances, settlement bank setup, withdrawals, and reconciliation.

## What This Repository Contains

```text
.
|-- Backend/          Express API, payment orchestration, PostgreSQL schema, Redis queues
|-- Mira/             React + Vite frontend for student payments and admin dashboard
|-- docker-compose.yml
`-- README.md
```

## Core Features

- Student payment initiation with Nomba sandbox checkout links.
- Partner account model for colleges, departments, and associations.
- PostgreSQL-backed payments, partner accounts, split rules, withdrawals, and admin users.
- Redis/BullMQ-backed withdrawal queue.
- Admin JWT authentication.
- Partner dashboard endpoints for balances, payment history, withdrawals, and reconciliation.
- Webhook endpoints for payment confirmation and disbursement updates.
- Local Docker Compose setup for PostgreSQL and Redis.

## Tech Stack

Frontend:

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/Radix UI components

Backend:

- Node.js
- Express
- PostgreSQL
- Redis
- BullMQ
- Nomba sandbox API
- JWT authentication
- Pino logging

## Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop with WSL integration enabled, if running on Windows/WSL
- Nomba sandbox credentials

## Local Setup

Install dependencies in both projects. There is no root-level `package.json`.

```bash
cd Backend
npm ci
```

```bash
cd ../Mira
npm ci
```

Start PostgreSQL and Redis:

```bash
cd <repository-root>
docker compose up -d
```

Start the backend:

```bash
cd Backend
npm run dev
```

Start the frontend:

```bash
cd Mira
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Environment Variables

Create `Backend/.env`:

```env
NODE_ENV=development
PORT=3000

PGHOST=localhost
PGPORT=5432
PGUSER=mira
PGPASSWORD=mira_dev_password
PGDATABASE=mira_dev

REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=1h
BANK_ENCRYPTION_KEY=

NOMBA_CLIENT_ID=
NOMBA_CLIENT_SECRET=
NOMBA_PARENT_ACCOUNT_ID=
NOMBA_SUB_ACCOUNT_ID=
NOMBA_SIGNATURE_KEY=
PAYMENT_CALLBACK_URL=http://localhost:8080/receipts

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
SYSTEM_EMAIL=
DEVELOPER_EMAIL=

SLACK_WEBHOOK_URL=
```

Create `Mira/.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_BACK_URL=http://localhost:3000
VITE_Nomba_PUBLIC_KEY=
```

Generate a local JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Database Initialization

The backend initializes the PostgreSQL schema on startup from `Backend/config/initDb.js`.

On a fresh database it creates and seeds:

- Partner accounts
- Partner sub-accounts
- Split rules
- Admin users
- Payment and withdrawal tables
- Ledger and reconciliation tables

Seeded local admin users:

```text
admin@Mira.com / password123
colerm_admin@Mira.com / password123
```

These are development credentials only. Replace them before any real deployment.

## Key API Endpoints

Payment initiation:

```http
POST /api/payments/initiate
```

Example request:

```json
{
  "email": "student@example.com",
  "payerName": "Test Student",
  "amount": 3000,
  "partnerIdentifier": "COLERM",
  "businessVertical": "education",
  "metadata": {
    "matricNumber": "20201234",
    "level": "200",
    "mainLevel": "Staylite"
  },
  "callbackUrl": "http://localhost:8080/receipts"
}
```

Other useful endpoints:

```text
GET  /
GET  /api/payments/confirm/:reference
GET  /api/payments/receipts/:receiptNumber
POST /api/payments/webhook/:gateway
POST /api/admin/auth/register
POST /api/admin/auth/login
GET  /api/admin/partner/balance
GET  /api/admin/partner/payments
POST /api/admin/partner/bank-lookup
POST /api/admin/partner/bank-account
POST /api/admin/partner/withdraw
GET  /api/admin/partner/withdrawals
POST /api/admin/reconcile
```

The OpenAPI spec is available at:

```text
Backend/docs/openapi.yaml
```

## Verification Commands

Health check:

```bash
curl -i http://localhost:3000/
```

Initiate a payment:

```bash
curl -i -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  --data '{
    "email": "test@example.com",
    "payerName": "Test User",
    "amount": 3000,
    "partnerIdentifier": "COLERM",
    "businessVertical": "education",
    "metadata": {
      "matricNumber": "20201234",
      "level": "200",
      "mainLevel": "Staylite"
    },
    "callbackUrl": "http://localhost:8080/receipts"
  }'
```

Admin login:

```bash
curl -i -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  --data '{
    "email": "colerm_admin@Mira.com",
    "password": "password123"
  }'
```

## Common Failure Modes

`400` from `/api/payments/initiate` can mean:

- The request failed Joi validation, usually invalid email, missing payer name, or `amount <= 0`.
- The partner has no active Nomba sub-account configured.
- Nomba returned an error and the controller wrapped it as a `400`.
- Live environment variables do not match the local setup.

`404` from `/api/payments/initiate` usually means:

- `partnerIdentifier` does not exist or is inactive in the database.

Browser CORS failures usually mean:

- The frontend origin is not listed in `Backend/server.js` CORS options.

## Deployment Notes

For production or hosted demo environments, configure these values on the hosting provider:

- PostgreSQL connection variables
- Redis connection variables
- JWT secret
- Nomba credentials
- Payment callback URL
- Frontend `VITE_API_URL`

The frontend API client reads `VITE_API_URL` and falls back to the Railway API URL currently in `Mira/src/lib/api.ts`.

## Reviewer Notes

The fastest way to validate the core submission path is:

1. Start Docker services.
2. Start the backend.
3. Start the frontend.
4. Submit a COLERM or COLPHYS payment from the frontend.
5. Confirm the backend returns a Nomba sandbox checkout URL.
6. Log in as `colerm_admin@Mira.com` and verify the payment appears in partner payment history.

The project favors an end-to-end working hackathon demo: local service orchestration, payment initiation, partner records, admin authentication, and dashboard reads are the primary evaluation paths.
