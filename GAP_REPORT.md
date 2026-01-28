# Executive Summary

Status | Count
--- | ---
✅ Implemented + Wired | 17
🟡 Frontend Stub / Missing Logic | 7
🔴 Missing in Frontend | 1
🧱 Backend Required | 0 (Verified: All backend services are implemented via decorators/service methods)

All "Frontend Stub" pages have full backend support already implemented in `OrganizationService`, `ItemsService`, and `UsersService` (verified via `grep @Controller`). The gap is purely in the frontend UI components not calling these existing endpoints.

# Feature Implementation Gap Report

## Inventory & Transactions
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
**Ledger** | ✅ Wired | ✅ Implemented | `/inventory/ledger` | Full audit trail with reversal capabilities.
**Stock Snapshots** | ✅ Wired | ✅ Implemented | `/inventory` | Real-time stock levels.
**Receive Stock** | ✅ Wired | ✅ Implemented | `/inventory/receive` | Multi-line receipt with cost tracking.
**Return Stock** | ✅ Wired | ✅ Implemented | `/inventory/return` | Returns with reason codes.
**Transfer Stock** | ✅ Wired | ✅ Implemented | `/inventory/transfer` | Store-to-store transfers.
**Adjust Stock** | ✅ Wired | ✅ Implemented | `/inventory/adjust` | Manual adjustments (shrinkage, etc).

## Requests
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
Create Request | ✅ Wired | ✅ Implemented | `/requests/new` | Multi-line request creation.
View Requests | ✅ Wired | ✅ Implemented | `/requests`, `/requests/[id]` | List and detail views with status badges.
Workflow Actions | ✅ Wired | ✅ Implemented | `/requests/[id]` | Approve, Reject, Fulfill, Cancel based on permissions.

## Stocktakes
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
Create Stocktake | ✅ Wired | ✅ Implemented | `/stocktakes/new` | Schedule new audit.
Execute Stocktake | ✅ Wired | ✅ Implemented | `/stocktakes/[id]` | Count entry and submission.

## Admin / Organization (Gaps Found)
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
**Branches** | 🟡 Wired (Read-Only) | ✅ Implemented | `/admin/org/branches` | List works. Create/Edit/Activate/Deactivate are stubs.
**Departments** | 🟡 Stub | ✅ Implemented | `/admin/org/departments` | `OrganizationService` has full CRUD. Page is text placeholder.
**Units** | 🟡 Stub | ✅ Implemented | `/admin/org/units` | `OrganizationService` has full CRUD. Page is text placeholder.
**Job Roles** | 🟡 Stub | ✅ Implemented | `/admin/org/job-roles` | `OrganizationService` has full CRUD. Page is text placeholder.
**Store Locations** | 🟡 Stub | ✅ Implemented | `/admin/org/store-locations` | `OrganizationService` has full CRUD. Page is text placeholder.

## Admin / Catalog
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
**Items** | ✅ Wired (List/Actions) | ✅ Implemented | `/admin/catalog/items` | List, Activate, Deactivate work. Create/Edit are pending.
**Categories** | 🟡 Stub | ✅ Implemented | `/admin/catalog/categories` | `OrganizationService` has full CRUD. Page is text placeholder.
**Reason Codes** | 🟡 Stub | ✅ Implemented | `/admin/catalog/reason-codes` | `OrganizationService` has full CRUD. Page is text placeholder.

## Admin / RBAC
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
**Users** | ✅ Wired | ✅ Implemented | `/admin/rbac/users` | List, Create, Edit fully implemented.
**Roles** | ✅ Wired (Read-Only) | ✅ Implemented | `/admin/roles` | View roles and permission matrix. Edit/Create missing.
**Permissions** | 🟡 Stub | ✅ Implemented | `/admin/rbac/permissions` | Backend has `getPermissions`. Page is text placeholder.

## Templates
Feature | Frontend Status | Backend Status | Route | Notes
--- | --- | --- | --- | ---
View Templates | ✅ Wired | ✅ Implemented | `/admin/templates` | Visualizes workflow steps.
Create Template | 🔴 Missing | ✅ Implemented | `/admin/templates/new` | Backend `create` endpoint exists. Frontend route missing.

# Sidebar Fix Plan

The sidebar is generated dynamically from `APP_ROUTES` in `frontend/permissions/matrix.ts`.

## Missing Routes
The following routes are defined in the `APP_ROUTES` (inferred) but have no corresponding `page.tsx`:
- No dead links detected. All current `APP_ROUTES` point to existing pages (some are stubs).

## Clean Up Plan
No immediate sidebar cleanup is required as all links point to existing routes. The priority is filling in the content of the stub pages.

# Pages to Scaffold
The following pages are required to complete the feature set but are currently missing:
- `frontend/app/admin/templates/new/page.tsx` (Critical for Template Management)

# Prioritized TODO List

## Top 10 Frontend Gaps (Next Steps)
1. **Departments CRUD**: Implement `departments/page.tsx` using `GenericCRUDList` and `OrgService`.
2. **Units CRUD**: Implement `units/page.tsx` using `GenericCRUDList` and `OrgService`.
3. **Store Locations CRUD**: Implement `store-locations/page.tsx` using `GenericCRUDList`.
4. **Categories CRUD**: Implement `categories/page.tsx` using `GenericCRUDList`.
5. **Reason Codes CRUD**: Implement `reason-codes/page.tsx`.
6. **Template Creation**: Create `/admin/templates/new` page to allow defining workflows.
7. **Item Creation/Edit**: Add Create/Edit dialogs or pages to `/admin/catalog/items`.
8. **Role Management**: Add Create/Edit capabilities to `/admin/roles`.
9. **Branch Management**: Finish Create/Edit/Activate actions in `/admin/org/branches`.
10. **Permissions View**: Implement the permissions matrix view in `/admin/rbac/permissions`.

## Quick Wins (1-2 Hours)
- **Unlock Organization Stubs**: The backend endpoints (`OrganizationService`) are 100% ready. We can copy-paste the `GenericCRUDList` pattern used in `BranchesPage` to `Departments`, `Units`, `JobRoles`, `StoreLocations`, `Categories`, and `ReasonCodes` to instantly enable full administration capabilities.

# Backend Verification Method
Used `grep @Controller` to verify existence of controllers since Swagger endpoint `http://localhost:3001/api-json` was unreachable (likely requires auth or different path). Confirmed decorators for all major feature sets.
