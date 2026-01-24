export type Permission = string;

export const PERMISSIONS = {
    // Auth/Users
    USERS_READ: 'users.read',
    USERS_CREATE: 'users.create',
    USERS_UPDATE: 'users.update',
    USERS_DEACTIVATE: 'users.deactivate',
    ROLES_MANAGE: 'roles.manage',
    PERMISSIONS_MANAGE: 'permissions.manage',

    // Items
    ITEMS_READ: 'items.read',
    ITEMS_CREATE: 'items.create',
    ITEMS_UPDATE: 'items.update',
    ITEMS_DELETE: 'items.delete',
    ITEMS_STOCK_READ: 'items.stock.read',

    // Requests
    REQUESTS_READ: 'requests.read',
    REQUESTS_CREATE: 'requests.create',
    REQUESTS_SUBMIT: 'requests.submit',
    REQUESTS_REVIEW_START: 'requests.review.start',
    REQUESTS_REFACTOR: 'requests.refactor',
    REQUESTS_SEND_TO_APPROVAL: 'requests.sendToApproval',
    REQUESTS_APPROVE: 'requests.approve',
    REQUESTS_REJECT: 'requests.reject',
    REQUESTS_REASSIGN: 'requests.reassign',
    REQUESTS_FULFILL: 'requests.fulfill',
    REQUESTS_CANCEL: 'requests.cancel',

    // Inventory/Ledger
    INVENTORY_RECEIVE: 'inventory.receive',
    INVENTORY_RETURN: 'inventory.return',
    LEDGER_READ: 'ledger.read',
    LEDGER_REVERSE: 'ledger.reverse',
    INVENTORY_ADJUST: 'inventory.adjust',
    INVENTORY_ADJUST_OVER_THRESHOLD: 'inventory.adjust.over_threshold',

    // Stocktake
    STOCKTAKE_CREATE: 'stocktake.create',
    STOCKTAKE_READ: 'stocktake.read',
    STOCKTAKE_START_COUNT: 'stocktake.startCount',
    STOCKTAKE_SUBMIT_COUNT: 'stocktake.submitCount',
    STOCKTAKE_APPROVE: 'stocktake.approve',
    STOCKTAKE_APPLY: 'stocktake.apply',

    // Reports
    REPORTS_VIEW: 'reports.view',
    REPORTS_EXPORT: 'reports.export',
} as const;

export interface RouteConfig {
    label: string;
    icon?: string; // Icon name as string, component lookup handled in UI
    href: string;
    requiredPermissions: Permission[];
    navGroup: 'Dashboard' | 'Inventory' | 'Operations' | 'Admin' | 'Reports' | 'Settings';
}

export const APP_ROUTES: RouteConfig[] = [
    {
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: '/',
        requiredPermissions: [], // Public for auth users
        navGroup: 'Dashboard',
    },
    {
        label: 'Items',
        icon: 'Package',
        href: '/items',
        requiredPermissions: [PERMISSIONS.ITEMS_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Requests',
        icon: 'FileText',
        href: '/requests',
        requiredPermissions: [PERMISSIONS.REQUESTS_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Receive Stock',
        icon: 'Download',
        href: '/inventory/receive',
        requiredPermissions: [PERMISSIONS.INVENTORY_RECEIVE],
        navGroup: 'Operations',
    },
    {
        label: 'Return Stock',
        icon: 'Upload',
        href: '/inventory/return',
        requiredPermissions: [PERMISSIONS.INVENTORY_RETURN],
        navGroup: 'Operations',
    },
    {
        label: 'Stocktakes',
        icon: 'ClipboardCheck',
        href: '/stocktakes',
        requiredPermissions: [PERMISSIONS.STOCKTAKE_READ],
        navGroup: 'Operations',
    },
    {
        label: 'Stock On Hand',
        icon: 'BarChart3',
        href: '/reports/stock-on-hand',
        requiredPermissions: [PERMISSIONS.REPORTS_VIEW],
        navGroup: 'Reports',
    },
    {
        label: 'Movements',
        icon: 'Activity',
        href: '/reports/movements',
        requiredPermissions: [PERMISSIONS.REPORTS_VIEW],
        navGroup: 'Reports',
    },
    {
        label: 'Users',
        icon: 'Users',
        href: '/admin/users',
        requiredPermissions: [PERMISSIONS.USERS_READ],
        navGroup: 'Admin',
    },
];

export const PAGE_ACTIONS = {
    items: {
        create: [PERMISSIONS.ITEMS_CREATE],
        edit: [PERMISSIONS.ITEMS_UPDATE],
        delete: [PERMISSIONS.ITEMS_DELETE],
    },
    requests: {
        create: [PERMISSIONS.REQUESTS_CREATE],
        submit: [PERMISSIONS.REQUESTS_SUBMIT],
        approve: [PERMISSIONS.REQUESTS_APPROVE],
        reject: [PERMISSIONS.REQUESTS_REJECT],
        fulfill: [PERMISSIONS.REQUESTS_FULFILL],
    },
    stocktakes: {
        create: [PERMISSIONS.STOCKTAKE_CREATE],
        apply: [PERMISSIONS.STOCKTAKE_APPLY],
    },
};

// Helpers

export function hasAll(userPerms: Permission[], requiredPerms: Permission[]): boolean {
    if (requiredPerms.length === 0) return true;
    return requiredPerms.every((p) => userPerms.includes(p));
}

export function hasAny(userPerms: Permission[], requiredPerms: Permission[]): boolean {
    if (requiredPerms.length === 0) return true;
    return requiredPerms.some((p) => userPerms.includes(p));
}

export function canAccessRoute(userPerms: Permission[], routeHref: string): boolean {
    const route = APP_ROUTES.find((r) => r.href === routeHref);
    if (!route) return true; // Default to accessible if not defined, or logic for 404
    return hasAll(userPerms, route.requiredPermissions);
}

export function canDoAction(userPerms: Permission[], requiredPerms: Permission[]): boolean {
    return hasAll(userPerms, requiredPerms);
}
