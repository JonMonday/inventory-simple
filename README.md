# Production-Grade Inventory Management Web App

A full-stack, auditable inventory management system with RBAC, Excel-like UI, and industrial-grade ledger logic.

## 🚀 One-Command Deployment
Ensure you have Docker and Docker Compose installed.

```bash
docker compose up --build
```

### 🛠️ Local Development (Manual)
If you do not have Docker installed, follow these steps:

1. **Prerequisites**:
   - Install [PostgreSQL](https://www.postgresql.org/) and create a database named `inventory`.
   - Install [Redis](https://redis.io/).
   - Set environment variables in `.env` (copy from `.env.example`).

2. **Backend**:
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

3. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Swagger Docs: [http://localhost:3001/api](http://localhost:3001/api)

## 🔑 Default Credentials
- **Admin**: `admin@example.com` / `admin123`

## ✨ Core Features
- **Excel-like UI**: Powered by AG Grid for high-density keyboard-friendly data management.
- **Append-only Ledger**: Immutable history of every inventory movement (Audit Trail).
- **Transactional Consistency**: Database-level transactions ensure stock levels and ledger entries always match.
- **RBAC**: Granular permission-based access control.
- **Imports**: Robust background Excel importing via BullMQ.
- **Forecasting**: Consumption prediction using Moving Average algorithms.

## 🏗️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS, AG Grid
- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Jobs**: Redis, BullMQ
- **Infra**: Docker

## 📥 How to Import
1. Navigate to the **Bulk Import** page.
2. Select the provided `Inventory Template.xlsx`.
3. Monitor the background job status until completed.

## 📈 RBAC Structure
- **SuperAdmin**: Full access to all modules and user management.
- **Storekeeper**: Can receive, issue, and view items.
- **Auditor**: Read-only access to ledger and logs.
