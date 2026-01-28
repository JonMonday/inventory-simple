<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Neon Postgres Setup (Vercel + Prisma)

This project uses **Neon Postgres** as the database provider, optimized for serverless deployment on **Vercel**.

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Neon Postgres Connection URLs
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# JWT Secret
JWT_SECRET="your-secret-key-here"
```

**Important Notes:**
- `DATABASE_URL`: Use the **pooled connection URL** from Neon (contains `-pooler` in the hostname). This is used for application queries and is optimized for serverless environments.
- `DIRECT_URL`: Use the **direct connection URL** from Neon (without `-pooler`). This is used for migrations and schema operations.
- Both URLs can be found in your Neon project dashboard under "Connection Details".

### Project Setup

```bash
# Install dependencies
$ npm install

# Generate Prisma Client
$ npm run db:generate

# Run migrations (development - creates migration files)
$ npm run db:migrate

# Run migrations (production - applies existing migrations)
$ npm run db:migrate:deploy

# Seed the database with sample data
$ npm run db:seed

# Complete setup (generate + migrate + seed)
$ npm run db:setup
```

### Database Management Commands

```bash
# Generate Prisma Client after schema changes
$ npm run db:generate

# Create and apply a new migration (development)
$ npm run db:migrate

# Apply existing migrations (production/CI)
$ npm run db:migrate:deploy

# Seed the database
$ npm run db:seed

# Reset database (WARNING: deletes all data)
$ npm run db:reset

# Open Prisma Studio (database GUI)
$ npm run db:studio
```

### Seed Data

The seed script (`prisma/seed.ts`) creates realistic inventory data including:
- 2 Branches (Banjul, Serekunda)
- 8 Locations (warehouses, departments, sub-locations)
- 3 Categories with parent-child relationships
- 15 Items across different categories
- 3 Roles (Admin, InventoryManager, Requester) with 20 Permissions
- 6 Users with hashed passwords
- 5 Reason Codes for inventory movements
- Stock snapshots, ledger entries, requests, stocktakes, and audit logs

**Login Credentials (all users):**
- Password: `password123`
- Users:
  - `admin@inventory.com` (Admin)
  - `manager.banjul@inventory.com` (Inventory Manager)
  - `manager.serekunda@inventory.com` (Inventory Manager)
  - `requester1@inventory.com` (Requester)
  - `requester2@inventory.com` (Requester)
  - `requester3@inventory.com` (Requester)

## Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Vercel Deployment

### Prerequisites
1. Create a Neon Postgres database at [neon.tech](https://neon.tech)
2. Get both the **pooled** and **direct** connection URLs from your Neon dashboard

### Deployment Steps

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings → Environment Variables
   - Add `DATABASE_URL` (pooled URL with `-pooler`)
   - Add `DIRECT_URL` (direct URL without `-pooler`)
   - Add `JWT_SECRET` (your JWT secret key)

2. **Deploy:**
   ```bash
   # Install Vercel CLI (if not already installed)
   $ npm i -g vercel

   # Deploy
   $ vercel
   ```

3. **Run Migrations (First Deployment):**
   After deploying, run migrations using Vercel CLI or your CI/CD pipeline:
   ```bash
   # Using Vercel CLI
   $ vercel env pull .env.local
   $ npm run db:migrate:deploy
   $ npm run db:seed
   ```

### Important Notes for Vercel
- The `postinstall` script automatically runs `prisma generate` during build
- Use the **pooled connection URL** (`DATABASE_URL`) for all application queries
- Use the **direct connection URL** (`DIRECT_URL`) for migrations only
- The PrismaService uses a serverless-safe singleton pattern to prevent connection exhaustion
- Neon's serverless driver handles connection pooling automatically

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

