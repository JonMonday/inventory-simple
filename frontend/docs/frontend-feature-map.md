# Frontend Feature Map

This document tracks the implementation status of frontend features and their corresponding backend API endpoints.

## 1. Requests Module
Used for creating and managing inventory requests.

| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| List Requests | `/requests` | `list` | `GET /requests` | `requests.read` | DONE |
| View Request Detail | `/requests/:id` | `getById` | `GET /requests/:id` | `requests.read` | DONE |
| Request Lines Tab | `/requests/:id` | `getLines` | `GET /requests/:id/lines` | `requests.read` | STUBBED |
| Request Events Tab | `/requests/:id` | `getEvents` | `GET /requests/:id/events` | `requests.read` | STUBBED |
| Request Comments Tab | `/requests/:id` | `getComments` | `GET /requests/:id/comments` | `comments.read` | STUBBED |
| Request Assignments Tab | `/requests/:id` | `getAssignments` | `GET /requests/:id/assignments` | `requests.read` | STUBBED |
| Request Participants Tab | `/requests/:id` | `getParticipants` | `GET /requests/:id/participants` | `requests.read` | STUBBED |
| Request Reservations Tab | `/requests/:id` | `getReservations` | `GET /requests/:id/reservations` | `requests.read` | STUBBED |
| My Assignments | `/my-assignments` | `listAssignedToMe` | `GET /requests?assignedToMe=true` | `requests.read` | STUBBED |
| Create Request | `/requests/new` | `create` | `POST /requests` | `requests.create` | DONE |
| Update Request Header | `/requests/:id` | `update` | `PUT /requests/:id` | `requests.update` | STUBBED |
| Submit Request | `/requests/:id` | `submit` | `POST /requests/:id/submit` | `requests.submit` | DONE |
| Approve Request | `/requests/:id` | `approve` | `POST /requests/:id/approve` | `requests.approve` | DONE |
| Reject Request | `/requests/:id` | `reject` | `POST /requests/:id/reject` | `requests.reject` | DONE |
| Cancel Request | `/requests/:id` | `cancel` | `POST /requests/:id/cancel` | `requests.cancel` | DONE |
| Reassign Request | `/requests/:id` | `reassign` | `POST /requests/:id/reassign` | `requests.reassign` | DONE |
| Confirm Receipt | `/requests/:id` | `confirm` | `POST /requests/:id/confirm` | `requests.confirm` | DONE |
| Reserve Stock | `/requests/:id` | `reserve` | `POST /requests/:id/fulfillment/reserve` | `requests.reserve` | DONE |
| Issue Stock | `/requests/:id` | `issue` | `POST /requests/:id/fulfillment/issue` | `requests.issue` | DONE |
| Request Clone | `/requests/:id` | `clone` | `POST /requests/:id/clone` | `requests.clone` | DONE |
| Add Request Line | `/requests/:id` | `addLine` | `POST /requests/:id/lines` | `requests.lines.manage` | DONE |
| Update Request Line | `/requests/:id` | `updateLine` | `PATCH /requests/:id/lines/:lid` | `requests.lines.manage` | DONE |
| Remove Request Line | `/requests/:id` | `removeLine` | `POST /requests/:id/lines/:lid/remove` | `requests.lines.manage` | DONE |
| Add Comment | `/requests/:id` | `addComment` | `POST /requests/:id/comments` | `comments.create` | DONE |

### Request Form Dependencies
| Dependency | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- |
| Templates List | `TemplatesService.list` | `GET /templates` | `templates.read` | STUBBED |
| Items List | `InventoryService.getItems` | `GET /items` | `items.read` | STUBBED |
| Units List | `OrgService.getUnits` | `GET /units` | `units.read` | STUBBED |

## 2. Inventory Module
Used for tracking and managing stock.

| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Stock Snapshots | `/inventory/stock-snapshots` | `getSnapshots` | `GET /inventory/stock-snapshots` | `stock.read` | STUBBED |
| Snapshot Detail | `/inventory/stock-snapshots/:iid/:sid` | `getSnapshot` | `GET /inventory/stock-snapshots/:iid/:sid` | `stock.read` | STUBBED |
| Item Stock Drilldown | `/items/:id/stock` | `getItemStock` | `GET /items/:id/stock` | `stock.read` | STUBBED |
| Stock Availability | Component | `checkAvailability` | `POST /inventory/availability` | `stock.read` | STUBBED |
| List Locations | `/inventory/locations` | `getLocations` | `GET /inventory/locations` | `storeLocations.read` | DONE |
| List Reason Codes | `/inventory/reason-codes` | `getReasonCodes` | `GET /inventory/reason-codes` | `reasonCodes.read` | DONE |
| Receive Stock | `/inventory/receive` | `receive` | `POST /inventory/receive` | `inventory.receive` | DONE |
| Return Stock | `/inventory/return` | `return` | `POST /inventory/return` | `inventory.return` | DONE |
| Transfer Stock | `/inventory/transfer` | `transfer` | `POST /inventory/transfer` | `inventory.transfer` | DONE |
| Adjust Stock | `/inventory/adjust` | `adjust` | `POST /inventory/adjust` | `inventory.adjust` | DONE |

## 3. Ledger Module
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Ledger List | `/inventory/ledger` | `list` | `GET /ledger` | `ledger.read` | DONE |
| Ledger Detail | `/inventory/ledger/:id` | `getById` | `GET /ledger/:id` (Fallback: list filter) | `ledger.read` | STUBBED |
| Ledger Reversal | `/inventory/ledger/:id` | `reverse` | `POST /ledger/:id/reverse` | `ledger.reverse` | DONE |

## 4. Reservations Module
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Global Reservations | `/reservations` | `getGlobal` | `GET /reservations` | `reservations.read` | DONE |

## 5. Stocktakes Module
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| List Stocktakes | `/stocktakes` | `list` | `GET /stocktakes` | `stocktake.read` | STUBBED |
| View Stocktake | `/stocktakes/:id` | `getById` | `GET /stocktakes/:id` | `stocktake.read` | STUBBED |
| Create Stocktake | `/stocktakes/new` | `create` | `POST /stocktakes` | `stocktake.create` | STUBBED |
| Start Count | `/stocktakes/:id` | `startCount` | `POST /stocktakes/:id/start-count` | `stocktake.startCount` | STUBBED |
| Submit Count | `/stocktakes/:id` | `submitCount` | `POST /stocktakes/:id/submit-count` | `stocktake.submitCount` | STUBBED |
| Approve Stocktake | `/stocktakes/:id` | `approve` | `POST /stocktakes/:id/approve` | `stocktake.approve` | STUBBED |
| Apply Stocktake | `/stocktakes/:id` | `apply` | `POST /stocktakes/:id/apply` | `stocktake.apply` | STUBBED |
| Count Lines | `/stocktakes/:id` | `getLines` | `GET /stocktakes/:id/lines` | `stocktake.read` | STUBBED |

## 6. Reports Module
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Stock on Hand | `/reports/stock-on-hand` | `getStock` | `GET /reports/stock-on-hand` | `reports.view` | STUBBED |
| Movements Report | `/reports/movements` | `getMovements` | `GET /reports/movements` | `reports.view` | STUBBED |
| Low Stock Report | `/reports/low-stock` | `getLowStock` | `GET /reports/low-stock` | `reports.view` | STUBBED |
| Request KPIs | `/reports/request-kpis` | `getKPIs` | `GET /reports/request-kpis` | `reports.view` | STUBBED |
| Adjustments Summary | `/reports/adjustments-summary` | `getAdjustments` | `GET /reports/adjustments-summary` | `reports.view` | STUBBED |

## 7. Lookups Registry
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| View Registry | `/admin/lookups` | `getRegistry` | `GET /lookups` | `lookups.read` | STUBBED |
| View Table Data | `/admin/lookups/:name` | `getTable` | `GET /lookups/:name` | `lookups.read` | STUBBED |
| Upsert Entry | `/admin/lookups/:name` | `upsert` | `POST/PUT /lookups/:name` | `lookups.manage` | STUBBED |
| Activate Entry | `/admin/lookups/:name` | `activate` | `POST /lookups/:name/:id/activate` | `lookups.manage` | STUBBED |
| Deactivate Entry | `/admin/lookups/:name` | `deactivate` | `POST /lookups/:name/:id/deactivate` | `lookups.manage` | STUBBED |

## 8. Admin: Organization
| Entity | List (GET) | Create (POST) | Update (PUT/PATCH) | Activate (POST) | Deactivate (POST) | Permissions Prefix | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Branches | `/branches` | `/branches` | `/branches/:id` | `/branches/:id/activate` | `/branches/:id/deactivate` | `branches` | STUBBED |
| Departments | `/departments` | `/departments` | `/departments/:id` | `/departments/:id/activate` | `/departments/:id/deactivate` | `departments` | STUBBED |
| Units | `/units` | `/units` | `/units/:id` | `/units/:id/activate` | `/units/:id/deactivate` | `units` | STUBBED |
| Job Roles | `/job-roles` | `/job-roles` | `/job-roles/:id` | `/job-roles/:id/activate` | `/job-roles/:id/deactivate` | `jobRoles` | STUBBED |
| Store Locations | `/store-locations` | `/store-locations`| `/store-locations/:id` | `/store-locations/:id/activate` | `/store-locations/:id/deactivate` | `storeLocations` | STUBBED |

## 9. Admin: Catalog
| Entity | List (GET) | Create (POST) | Update (PUT/PATCH) | Activate (POST) | Deactivate (POST) | Permissions Prefix | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Items | `/items` | `/items` | `/items/:id` | `/items/:id/activate` | `/items/:id/deactivate` | `items` | STUBBED |
| Categories | `/categories` | `/categories` | `/categories/:id` | `/categories/:id/activate` | `/categories/:id/deactivate` | `categories` | STUBBED |
| Reason Codes | `/reason-codes` | `/reason-codes` | `/reason-codes/:id` | `/reason-codes/:id/activate` | `/reason-codes/:id/deactivate` | `reasonCodes` | STUBBED |

## 10. Admin: RBAC
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| List Users | `/admin/rbac/users` | `getUsers` | `GET /users` | `users.read` | STUBBED |
| Create User | `/admin/rbac/users/new`| `createUser` | `POST /users` | `users.create` | STUBBED |
| Update User | `/admin/rbac/users/:id` | `updateUser` | `PATCH /users/:id` | `users.update` | STUBBED |
| Assign Role | `/admin/rbac/users/:id` | `assignRole` | `POST /users/:id/roles` | `users.roles` | STUBBED |
| Remove Role | `/admin/rbac/users/:id` | `removeRole` | `DELETE /users/:id/roles/:rid` | `users.roles` | STUBBED |
| List Roles | `/admin/rbac/roles` | `getRoles` | `GET /roles` | `roles.read` | STUBBED |
| Create Role | `/admin/rbac/roles/new` | `createRole` | `POST /roles` | `roles.create` | STUBBED |
| Update Role | `/admin/rbac/roles/:id` | `updateRole` | `PATCH /roles/:id` | `roles.update` | STUBBED |
| Add Permission | `/admin/rbac/roles/:id` | `addPermission` | `POST /roles/:id/permissions` | `roles.manage` | STUBBED |
| Remove Permission | `/admin/rbac/roles/:id` | `removePermission` | `DELETE /roles/:id/permissions/:pid` | `roles.manage` | STUBBED |
| List Permissions | `/admin/rbac/permissions`| `getPermissions` | `GET /admin/permissions` | `permissions.read` | STUBBED |

## 11. Templates Module
| Feature | Page | Service Method | Endpoint | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| List Templates | `/admin/templates` | `list` | `GET /templates` | `templates.read` | STUBBED |
| Create Template | `/admin/templates/new` | `create` | `POST /templates` | `templates.create` | STUBBED |
| Update Template | `/admin/templates/:id` | `update` | `PATCH /templates/:id` | `templates.update` | STUBBED |
| Activate Template | `/admin/templates/:id` | `activate` | `POST /templates/:id/activate` | `templates.activate` | STUBBED |
| Deactivate Template | `/admin/templates/:id` | `deactivate` | `POST /templates/:id/deactivate` | `templates.deactivate` | STUBBED |
| Manage Workflow | `/admin/templates/:id` | `manage` | `STUBBED` | `templates.manage` | STUBBED |

## Suggested Enhancements (Optional / STUBBED)
- **Global Audit Viewer**: Activity log across all modules.
- **Export Hooks**: PDF/Excel export for all list views.
- **Global Search**: Unified search for requests and items.
- **API Wiring Checklist**: Dev-only page to track implementation.
