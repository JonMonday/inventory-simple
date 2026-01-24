export interface RouteTestConfig {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    permissions: string[];
    allowedRoles: string[];
    deniedRoles: string[];
    getPayload?: (context: any) => any;
    expectedSuccessStatus: number;
}

export const permissionMatrix: RouteTestConfig[] = [
    // Auth
    {
        path: '/auth/login',
        method: 'POST',
        permissions: [], // Public
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper', 'Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        deniedRoles: [],
        getPayload: () => ({ email: 'superadmin1@test.com', password: 'Passw0rd!' }),
        expectedSuccessStatus: 200
    },

    // Items
    {
        path: '/items',
        method: 'GET',
        permissions: ['items.read'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper', 'DepartmentUser', 'Auditor', 'Viewer'],
        deniedRoles: ['Approver'], // Approver only has requests/stocktake perms in my seed
        expectedSuccessStatus: 200
    },
    {
        path: '/items',
        method: 'POST',
        permissions: ['items.create'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin'],
        deniedRoles: ['Storekeeper', 'Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        getPayload: (ctx) => ({ code: `ITEM-NEW-${Date.now()}`, name: 'New Item', categoryId: ctx.categoryId, unitOfMeasure: 'UNIT' }),
        expectedSuccessStatus: 201
    },

    // Users
    {
        path: '/users',
        method: 'GET',
        permissions: ['users.read'],
        allowedRoles: ['SuperAdmin'],
        deniedRoles: ['InventoryAdmin', 'Storekeeper', 'Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        expectedSuccessStatus: 200
    },

    // Requests
    {
        path: '/requests',
        method: 'GET',
        permissions: ['requests.read'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper', 'Approver', 'DepartmentUser', 'Auditor'],
        deniedRoles: ['Viewer'],
        expectedSuccessStatus: 200
    },
    {
        path: '/requests',
        method: 'POST',
        permissions: ['requests.create'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'DepartmentUser'],
        deniedRoles: ['Storekeeper', 'Approver', 'Auditor', 'Viewer'],
        getPayload: (ctx) => ({ lines: [{ itemId: ctx.itemId, quantity: 5 }] }),
        expectedSuccessStatus: 201
    },

    // Inventory
    {
        path: '/inventory/receive',
        method: 'POST',
        permissions: ['ledger.create'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper'],
        deniedRoles: ['Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        getPayload: (ctx) => ({ locationId: ctx.storeId, lines: [{ itemId: ctx.itemId, quantity: 10, unitCost: 10 }] }),
        expectedSuccessStatus: 201
    },
    {
        path: '/inventory/return',
        method: 'POST',
        permissions: ['ledger.create'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper'],
        deniedRoles: ['Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        getPayload: (ctx) => ({ itemId: ctx.itemId, fromLocationId: ctx.deptId, toLocationId: ctx.storeId, quantity: 2, reasonCodeId: ctx.rcvRtnReasonId, comments: 'E2E Return' }),
        expectedSuccessStatus: 201
    },

    // Ledger
    {
        path: '/ledger/:id/reverse',
        method: 'POST',
        permissions: ['ledger.correct'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin'],
        deniedRoles: ['Storekeeper', 'Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        getPayload: (ctx) => ({ reasonCodeId: ctx.revErrReasonId, notes: 'E2E Reversal' }),
        expectedSuccessStatus: 201
    },

    // Stocktakes
    {
        path: '/stocktakes',
        method: 'GET',
        permissions: ['stocktake.read'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper', 'Approver', 'Auditor'],
        deniedRoles: ['DepartmentUser', 'Viewer'],
        expectedSuccessStatus: 200
    },

    // Reports
    {
        path: '/reports/stock-on-hand',
        method: 'GET',
        permissions: ['reports.view'],
        allowedRoles: ['SuperAdmin', 'InventoryAdmin', 'Storekeeper', 'Approver', 'DepartmentUser', 'Auditor', 'Viewer'],
        deniedRoles: [],
        expectedSuccessStatus: 200
    }
];
