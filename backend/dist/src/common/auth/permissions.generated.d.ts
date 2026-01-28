export declare const PERMISSIONS: {
    readonly BRANCHES_ACTIVATE: "branches.activate";
    readonly BRANCHES_CREATE: "branches.create";
    readonly BRANCHES_DEACTIVATE: "branches.deactivate";
    readonly BRANCHES_READ: "branches.read";
    readonly BRANCHES_UPDATE: "branches.update";
    readonly CATEGORIES_ACTIVATE: "categories.activate";
    readonly CATEGORIES_CREATE: "categories.create";
    readonly CATEGORIES_DEACTIVATE: "categories.deactivate";
    readonly CATEGORIES_READ: "categories.read";
    readonly CATEGORIES_UPDATE: "categories.update";
    readonly COMMENTS_CREATE: "comments.create";
    readonly COMMENTS_READ: "comments.read";
    readonly DEPARTMENTS_ACTIVATE: "departments.activate";
    readonly DEPARTMENTS_CREATE: "departments.create";
    readonly DEPARTMENTS_DEACTIVATE: "departments.deactivate";
    readonly DEPARTMENTS_READ: "departments.read";
    readonly DEPARTMENTS_UPDATE: "departments.update";
    readonly INVENTORY_ADJUST: "inventory.adjust";
    readonly INVENTORY_RECEIVE: "inventory.receive";
    readonly INVENTORY_RETURN: "inventory.return";
    readonly INVENTORY_TRANSFER: "inventory.transfer";
    readonly ITEMS_ACTIVATE: "items.activate";
    readonly ITEMS_CREATE: "items.create";
    readonly ITEMS_DEACTIVATE: "items.deactivate";
    readonly ITEMS_READ: "items.read";
    readonly ITEMS_UPDATE: "items.update";
    readonly JOB_ROLES_ACTIVATE: "jobRoles.activate";
    readonly JOB_ROLES_CREATE: "jobRoles.create";
    readonly JOB_ROLES_DEACTIVATE: "jobRoles.deactivate";
    readonly JOB_ROLES_READ: "jobRoles.read";
    readonly JOB_ROLES_UPDATE: "jobRoles.update";
    readonly LEDGER_READ: "ledger.read";
    readonly LEDGER_REVERSE: "ledger.reverse";
    readonly LOOKUPS_MANAGE: "lookups.manage";
    readonly LOOKUPS_READ: "lookups.read";
    readonly PERMISSIONS_MANAGE: "permissions.manage";
    readonly PERMISSIONS_READ: "permissions.read";
    readonly REASON_CODES_ACTIVATE: "reasonCodes.activate";
    readonly REASON_CODES_CREATE: "reasonCodes.create";
    readonly REASON_CODES_DEACTIVATE: "reasonCodes.deactivate";
    readonly REASON_CODES_READ: "reasonCodes.read";
    readonly REASON_CODES_UPDATE: "reasonCodes.update";
    readonly REPORTS_VIEW: "reports.view";
    readonly REQUESTS_APPROVE: "requests.approve";
    readonly REQUESTS_CANCEL: "requests.cancel";
    readonly REQUESTS_CLONE: "requests.clone";
    readonly REQUESTS_CONFIRM: "requests.confirm";
    readonly REQUESTS_CREATE: "requests.create";
    readonly REQUESTS_DELETE: "requests.delete";
    readonly REQUESTS_ISSUE: "requests.issue";
    readonly REQUESTS_LINES_MANAGE: "requests.lines.manage";
    readonly REQUESTS_READ: "requests.read";
    readonly REQUESTS_REASSIGN: "requests.reassign";
    readonly REQUESTS_REJECT: "requests.reject";
    readonly REQUESTS_RESERVE: "requests.reserve";
    readonly REQUESTS_SUBMIT: "requests.submit";
    readonly REQUESTS_UPDATE: "requests.update";
    readonly RESERVATIONS_READ: "reservations.read";
    readonly ROLES_CREATE: "roles.create";
    readonly ROLES_DELETE: "roles.delete";
    readonly ROLES_MANAGE: "roles.manage";
    readonly ROLES_READ: "roles.read";
    readonly ROLES_UPDATE: "roles.update";
    readonly STOCK_READ: "stock.read";
    readonly STOCKTAKE_APPLY: "stocktake.apply";
    readonly STOCKTAKE_APPROVE: "stocktake.approve";
    readonly STOCKTAKE_CREATE: "stocktake.create";
    readonly STOCKTAKE_READ: "stocktake.read";
    readonly STOCKTAKE_START_COUNT: "stocktake.startCount";
    readonly STOCKTAKE_SUBMIT_COUNT: "stocktake.submitCount";
    readonly STORE_LOCATIONS_ACTIVATE: "storeLocations.activate";
    readonly STORE_LOCATIONS_CREATE: "storeLocations.create";
    readonly STORE_LOCATIONS_DEACTIVATE: "storeLocations.deactivate";
    readonly STORE_LOCATIONS_READ: "storeLocations.read";
    readonly STORE_LOCATIONS_UPDATE: "storeLocations.update";
    readonly TEMPLATES_ACTIVATE: "templates.activate";
    readonly TEMPLATES_CREATE: "templates.create";
    readonly TEMPLATES_DEACTIVATE: "templates.deactivate";
    readonly TEMPLATES_MANAGE: "templates.manage";
    readonly TEMPLATES_READ: "templates.read";
    readonly TEMPLATES_UPDATE: "templates.update";
    readonly UNITS_ACTIVATE: "units.activate";
    readonly UNITS_CREATE: "units.create";
    readonly UNITS_DEACTIVATE: "units.deactivate";
    readonly UNITS_READ: "units.read";
    readonly UNITS_UPDATE: "units.update";
    readonly USERS_CREATE: "users.create";
    readonly USERS_DELETE: "users.delete";
    readonly USERS_READ: "users.read";
    readonly USERS_ROLES: "users.roles";
    readonly USERS_UPDATE: "users.update";
};
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export declare const PERMISSIONS_META: readonly [{
    readonly key: "branches.activate";
    readonly label: "Activate Branches";
    readonly group: "Organization";
}, {
    readonly key: "branches.create";
    readonly label: "Create Branches";
    readonly group: "Organization";
}, {
    readonly key: "branches.deactivate";
    readonly label: "Deactivate Branches";
    readonly group: "Organization";
}, {
    readonly key: "branches.read";
    readonly label: "Read Branches";
    readonly group: "Organization";
}, {
    readonly key: "branches.update";
    readonly label: "Update Branches";
    readonly group: "Organization";
}, {
    readonly key: "categories.activate";
    readonly label: "Activate Categories";
    readonly group: "Catalog";
}, {
    readonly key: "categories.create";
    readonly label: "Create Categories";
    readonly group: "Catalog";
}, {
    readonly key: "categories.deactivate";
    readonly label: "Deactivate Categories";
    readonly group: "Catalog";
}, {
    readonly key: "categories.read";
    readonly label: "Read Categories";
    readonly group: "Catalog";
}, {
    readonly key: "categories.update";
    readonly label: "Update Categories";
    readonly group: "Catalog";
}, {
    readonly key: "comments.create";
    readonly label: "Create Comments";
    readonly group: "Social";
}, {
    readonly key: "comments.read";
    readonly label: "Read Comments";
    readonly group: "Social";
}, {
    readonly key: "departments.activate";
    readonly label: "Activate Departments";
    readonly group: "Organization";
}, {
    readonly key: "departments.create";
    readonly label: "Create Departments";
    readonly group: "Organization";
}, {
    readonly key: "departments.deactivate";
    readonly label: "Deactivate Departments";
    readonly group: "Organization";
}, {
    readonly key: "departments.read";
    readonly label: "Read Departments";
    readonly group: "Organization";
}, {
    readonly key: "departments.update";
    readonly label: "Update Departments";
    readonly group: "Organization";
}, {
    readonly key: "inventory.adjust";
    readonly label: "Adjust Stock";
    readonly group: "Inventory";
}, {
    readonly key: "inventory.receive";
    readonly label: "Receive Stock";
    readonly group: "Inventory";
}, {
    readonly key: "inventory.return";
    readonly label: "Return Stock";
    readonly group: "Inventory";
}, {
    readonly key: "inventory.transfer";
    readonly label: "Transfer Stock";
    readonly group: "Inventory";
}, {
    readonly key: "items.activate";
    readonly label: "Activate Items";
    readonly group: "Catalog";
}, {
    readonly key: "items.create";
    readonly label: "Create Items";
    readonly group: "Catalog";
}, {
    readonly key: "items.deactivate";
    readonly label: "Deactivate Items";
    readonly group: "Catalog";
}, {
    readonly key: "items.read";
    readonly label: "Read Items";
    readonly group: "Catalog";
}, {
    readonly key: "items.update";
    readonly label: "Update Items";
    readonly group: "Catalog";
}, {
    readonly key: "jobRoles.activate";
    readonly label: "Activate Job Roles";
    readonly group: "Organization";
}, {
    readonly key: "jobRoles.create";
    readonly label: "Create Job Roles";
    readonly group: "Organization";
}, {
    readonly key: "jobRoles.deactivate";
    readonly label: "Deactivate Job Roles";
    readonly group: "Organization";
}, {
    readonly key: "jobRoles.read";
    readonly label: "Read Job Roles";
    readonly group: "Organization";
}, {
    readonly key: "jobRoles.update";
    readonly label: "Update Job Roles";
    readonly group: "Organization";
}, {
    readonly key: "ledger.read";
    readonly label: "Read Ledger";
    readonly group: "Inventory";
}, {
    readonly key: "ledger.reverse";
    readonly label: "Reverse Ledger Entry";
    readonly group: "Inventory";
}, {
    readonly key: "lookups.manage";
    readonly label: "Manage Lookups";
    readonly group: "Admin";
}, {
    readonly key: "lookups.read";
    readonly label: "Read Lookups";
    readonly group: "Admin";
}, {
    readonly key: "permissions.manage";
    readonly label: "Manage Permissions";
    readonly group: "RBAC";
}, {
    readonly key: "permissions.read";
    readonly label: "Read Permissions";
    readonly group: "RBAC";
}, {
    readonly key: "reasonCodes.activate";
    readonly label: "Activate Reason Codes";
    readonly group: "Catalog";
}, {
    readonly key: "reasonCodes.create";
    readonly label: "Create Reason Codes";
    readonly group: "Catalog";
}, {
    readonly key: "reasonCodes.deactivate";
    readonly label: "Deactivate Reason Codes";
    readonly group: "Catalog";
}, {
    readonly key: "reasonCodes.read";
    readonly label: "Read Reason Codes";
    readonly group: "Catalog";
}, {
    readonly key: "reasonCodes.update";
    readonly label: "Update Reason Codes";
    readonly group: "Catalog";
}, {
    readonly key: "reports.view";
    readonly label: "View Reports";
    readonly group: "Reports";
}, {
    readonly key: "requests.approve";
    readonly label: "Approve Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.cancel";
    readonly label: "Cancel Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.clone";
    readonly label: "Clone Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.confirm";
    readonly label: "Confirm Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.create";
    readonly label: "Create Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.delete";
    readonly label: "Delete Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.issue";
    readonly label: "Issue Stock for Request";
    readonly group: "Requests";
}, {
    readonly key: "requests.lines.manage";
    readonly label: "Manage Request Lines";
    readonly group: "Requests";
}, {
    readonly key: "requests.read";
    readonly label: "Read Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.reassign";
    readonly label: "Reassign Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.reject";
    readonly label: "Reject Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.reserve";
    readonly label: "Reserve Stock for Request";
    readonly group: "Requests";
}, {
    readonly key: "requests.submit";
    readonly label: "Submit Requests";
    readonly group: "Requests";
}, {
    readonly key: "requests.update";
    readonly label: "Update Requests";
    readonly group: "Requests";
}, {
    readonly key: "reservations.read";
    readonly label: "Read Reservations";
    readonly group: "Inventory";
}, {
    readonly key: "roles.create";
    readonly label: "Create Roles";
    readonly group: "RBAC";
}, {
    readonly key: "roles.delete";
    readonly label: "Delete Roles";
    readonly group: "RBAC";
}, {
    readonly key: "roles.manage";
    readonly label: "Manage Role Permissions";
    readonly group: "RBAC";
}, {
    readonly key: "roles.read";
    readonly label: "Read Roles";
    readonly group: "RBAC";
}, {
    readonly key: "roles.update";
    readonly label: "Update Roles";
    readonly group: "RBAC";
}, {
    readonly key: "stock.read";
    readonly label: "Read Stock Levels";
    readonly group: "Inventory";
}, {
    readonly key: "stocktake.apply";
    readonly label: "Apply Stocktake";
    readonly group: "Stocktake";
}, {
    readonly key: "stocktake.approve";
    readonly label: "Approve Stocktake";
    readonly group: "Stocktake";
}, {
    readonly key: "stocktake.create";
    readonly label: "Create Stocktakes";
    readonly group: "Stocktake";
}, {
    readonly key: "stocktake.read";
    readonly label: "Read Stocktakes";
    readonly group: "Stocktake";
}, {
    readonly key: "stocktake.startCount";
    readonly label: "Start Stocktake Count";
    readonly group: "Stocktake";
}, {
    readonly key: "stocktake.submitCount";
    readonly label: "Submit Stocktake Count";
    readonly group: "Stocktake";
}, {
    readonly key: "storeLocations.activate";
    readonly label: "Activate Store Locations";
    readonly group: "Organization";
}, {
    readonly key: "storeLocations.create";
    readonly label: "Create Store Locations";
    readonly group: "Organization";
}, {
    readonly key: "storeLocations.deactivate";
    readonly label: "Deactivate Store Locations";
    readonly group: "Organization";
}, {
    readonly key: "storeLocations.read";
    readonly label: "Read Store Locations";
    readonly group: "Organization";
}, {
    readonly key: "storeLocations.update";
    readonly label: "Update Store Locations";
    readonly group: "Organization";
}, {
    readonly key: "templates.activate";
    readonly label: "Activate Templates";
    readonly group: "Admin";
}, {
    readonly key: "templates.create";
    readonly label: "Create Templates";
    readonly group: "Admin";
}, {
    readonly key: "templates.deactivate";
    readonly label: "Deactivate Templates";
    readonly group: "Admin";
}, {
    readonly key: "templates.manage";
    readonly label: "Manage Templates";
    readonly group: "Admin";
}, {
    readonly key: "templates.read";
    readonly label: "Read Templates";
    readonly group: "Admin";
}, {
    readonly key: "templates.update";
    readonly label: "Update Templates";
    readonly group: "Admin";
}, {
    readonly key: "units.activate";
    readonly label: "Activate Units";
    readonly group: "Organization";
}, {
    readonly key: "units.create";
    readonly label: "Create Units";
    readonly group: "Organization";
}, {
    readonly key: "units.deactivate";
    readonly label: "Deactivate Units";
    readonly group: "Organization";
}, {
    readonly key: "units.read";
    readonly label: "Read Units";
    readonly group: "Organization";
}, {
    readonly key: "units.update";
    readonly label: "Update Units";
    readonly group: "Organization";
}, {
    readonly key: "users.create";
    readonly label: "Create Users";
    readonly group: "RBAC";
}, {
    readonly key: "users.delete";
    readonly label: "Delete Users";
    readonly group: "RBAC";
}, {
    readonly key: "users.read";
    readonly label: "Read Users";
    readonly group: "RBAC";
}, {
    readonly key: "users.roles";
    readonly label: "Manage User Roles";
    readonly group: "RBAC";
}, {
    readonly key: "users.update";
    readonly label: "Update Users";
    readonly group: "RBAC";
}];
