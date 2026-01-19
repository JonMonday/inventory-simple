# Inventory Management System

A production-ready inventory management system with automated database migrations and seeding.

## 🚀 Quickstart

Ensure you have Docker installed, then run:

```bash
docker compose up --build
```

This will:
1. Start Postgres, Redis, pgAdmin, Backend, and Frontend.
2. Automatically run `prisma generate`.
3. Automatically run `prisma migrate deploy`.
4. Automatically run `prisma db seed`.
5. Start the backend server on port 3001.

---

## 🛠️ Troubleshooting "Chunk Commands"

Use these commands for manual troubleshooting or specific actions without restarting the entire stack.

### Rebuild only
```bash
docker compose build
```

### Start only database services
```bash
docker compose up -d postgres redis pgadmin
```

### Run migrations only
```bash
docker compose exec backend npm run prisma:migrate
```

### Run seed only
```bash
docker compose exec backend npm run prisma:seed
```

### Check logs per service
```bash
# All logs
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f postgres
```

### Open PSQL inside container
```bash
docker compose exec postgres psql -U postgres -d inventory
```

### Reset DB Volume (WARNING: Deletes all data!)
```bash
docker compose down -v
docker compose up --build
```

---

## 📊 pgAdmin Guide

Use pgAdmin to visualize and manage your database data.

1. **Open pgAdmin**: [http://localhost:5050](http://localhost:5050)
2. **Login**: No password required (configured in `docker-compose.yml`).
3. **Register Server**:
   - Right-click "Servers" > Register > Server...
   - **General Tab**: Name it `Inventory DB`
   - **Connection Tab**:
     - **Host name/address**: `postgres` (This is the service name in docker-compose, NOT localhost)
     - **Port**: `5432`
     - **Maintenance database**: `inventory`
     - **Username**: `postgres`
     - **Password**: `postgres` (or whatever is in your `.env`)
     - **Save Password**: Checked
4. Click **Save**.

---

## ✅ Verification Steps

### Confirm Tables Exist
1. In pgAdmin, navigate to: `Inventory DB` > `Databases` > `inventory` > `Schemas` > `public` > `Tables`.
2. You should see: `Category`, `Product`, `Role`, `StockMovement`, `User`, `Warehouse`, and `_prisma_migrations`.

### Confirm Seeded Rows
Right-click on any table (e.g., `Product`) > View/Edit Data > All Rows.
- **Role**: Should have `Admin` and `Staff`.
- **User**: Should have `admin@example.com`.
- **Category**: Should have 3 categories (Electronics, Furniture, Office Supplies).
- **Product**: Should have 5 products.
- **StockMovement**: Should have 4 initial entries.

---

## 🔑 Default Credentials
- **Admin Email**: `admin@example.com`
- **Password**: `admin123`
