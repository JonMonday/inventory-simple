# Backend E2E Test Suite

This suite provides exhaustive verification of RBAC, business workflows, and system stability under load.

## User & Branch Structure
- **Branches**: 10 branches (BR-001..BR-010).
- **Locations**: Each branch has 1 `STORE` and 3 `DEPARTMENT` locations.
- **Users**: 200 users distributed across roles:
  - SuperAdmin (1 per branch)
  - InventoryAdmin (2 per branch)
  - Storekeeper (5 per branch)
  - Approver (3 per branch)
  - DepartmentUser (6 per branch)
  - Auditor (2 per branch)
  - Viewer (1 per branch)
- **Deterministic Credentials**:
  - Email: `{role_name}{number}@test.com` (e.g., `storekeeper1@test.com`)
  - Password: `Passw0rd!`

## Test Modes
Tests utilize a token-caching harness for speed.

### FAST (Default)
Standard `npm run test:e2e:fast`.
- Pick a sample of 2 users per role.
- Executes full functional flows.
- Fast execution for developer feedback.

### FULL
Exhaustive `npm run test:e2e:full`.
- Logins and validates ALL 200 users against the permission matrix.
- Runs stress tests for concurrency.

## Commands
```bash
# General E2E (uses FAST mode)
npm run test:e2e

# Fast Mode Explicit
npm run test:e2e:fast

# Full Suite (Exhaustive)
npm run test:e2e:full
```

## Infrastructure
- **Database**: Each worker uses a dedicated SQLite file in `/tmp/e2e-*.sqlite`.
- **Reset**: The database is reset with `prisma db push --force-reset` and seeded with `test-seed.ts` before each suite.
- **Token Cache**: Users are logged in once at the start of the `beforeAll` block and tokens are cached in memory.

## Scenarios Covered
1. **Permission Matrix**: 401/403/200 validation for all implemented routes.
2. **Reservation Lifecycle**: Atomic stock reservation and release.
3. **Fulfillment Rollback**: All-or-nothing stock movements during request fulfillment.
4. **Returns & Reversals**: Counter-ledger entries and double-reversal prevention.
5. **Concurrency Stress**:
   - Sequential ID uniqueness (REQ-YYYY-####).
   - High-load stock reservation contention.
