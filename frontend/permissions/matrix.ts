import { PERMISSIONS, type Permission } from './permissions.generated';

export { PERMISSIONS };
export type { Permission };



// Config export

/* 
 * NOTE: The APP_ROUTES below use PERMISSIONS from the generated file.
 * This ensures frontend and backend are in sync.
 */

/*
export const PERMISSIONS_OLD = {
    // Auth & Users
    USERS_READ: 'users.read',
    // ...
} as const;
*/

export interface RouteConfig {
    label: string;
    icon?: string;
    href: string;
    requiredPermissions: Permission[];
    anyPermissions?: Permission[];
    navGroup: 'Dashboard' | 'Inventory' | 'Operations' | 'Admin' | 'Reports';
}

export const APP_ROUTES: RouteConfig[] = [
    {
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: '/',
        requiredPermissions: [],
        navGroup: 'Dashboard',
    },

    // === Inventory Group ===
    {
        label: 'Staff Requests',
        icon: 'FileText',
        href: '/requests',
        requiredPermissions: [PERMISSIONS.REQUESTS_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Review Queue',
        icon: 'Inbox',
        href: '/my-assignments',
        requiredPermissions: [PERMISSIONS.REQUESTS_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Stock Browser',
        icon: 'Package',
        href: '/inventory',
        requiredPermissions: [PERMISSIONS.STOCK_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Reservations',
        icon: 'Lock',
        href: '/reservations',
        requiredPermissions: [PERMISSIONS.RESERVATIONS_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Stock Snapshots',
        icon: 'History',
        href: '/inventory/stock-snapshots',
        requiredPermissions: [PERMISSIONS.STOCK_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Locations',
        icon: 'MapPin',
        href: '/inventory/locations',
        requiredPermissions: [PERMISSIONS.STORE_LOCATIONS_READ],
        navGroup: 'Inventory',
    },
    {
        label: 'Reason Codes',
        icon: 'Tags',
        href: '/inventory/reason-codes',
        requiredPermissions: [PERMISSIONS.REASON_CODES_READ],
        navGroup: 'Inventory',
    },

    // === Operations Group ===
    {
        label: 'Receive Stock',
        icon: 'PlusCircle',
        href: '/inventory/receive',
        requiredPermissions: [PERMISSIONS.INVENTORY_RECEIVE],
        navGroup: 'Operations',
    },
    {
        label: 'Transfer Stock',
        icon: 'ArrowLeftRight',
        href: '/inventory/transfer',
        requiredPermissions: [PERMISSIONS.INVENTORY_TRANSFER],
        navGroup: 'Operations',
    },
    {
        label: 'Return Stock',
        icon: 'RotateCcw',
        href: '/inventory/return',
        requiredPermissions: [PERMISSIONS.INVENTORY_RETURN],
        navGroup: 'Operations',
    },
    {
        label: 'Adjust Stock',
        icon: 'SlidersHorizontal',
        href: '/inventory/adjust',
        requiredPermissions: [PERMISSIONS.INVENTORY_ADJUST],
        navGroup: 'Operations',
    },
    {
        label: 'Stocktakes',
        icon: 'ClipboardCheck',
        href: '/stocktakes',
        requiredPermissions: [PERMISSIONS.STOCKTAKE_READ],
        navGroup: 'Operations',
    },

    // === Reports Group ===
    {
        label: 'Stock On Hand',
        icon: 'Layers',
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
        label: 'Movement Ledger',
        icon: 'List',
        href: '/inventory/ledger',
        requiredPermissions: [PERMISSIONS.LEDGER_READ],
        navGroup: 'Reports',
    },
    {
        label: 'Request KPIs',
        icon: 'LineChart',
        href: '/reports/request-kpis',
        requiredPermissions: [PERMISSIONS.REPORTS_VIEW],
        navGroup: 'Reports',
    },
    {
        label: 'Low Stock Alert',
        icon: 'AlertTriangle',
        href: '/reports/low-stock',
        requiredPermissions: [PERMISSIONS.REPORTS_VIEW],
        navGroup: 'Reports',
    },
    {
        label: 'Adjustments Sum',
        icon: 'FilePieChart',
        href: '/reports/adjustments-summary',
        requiredPermissions: [PERMISSIONS.REPORTS_VIEW],
        navGroup: 'Reports',
    },

    // === Admin Group ===
    // RBAC
    {
        label: 'Users',
        icon: 'Users',
        href: '/admin/rbac/users',
        requiredPermissions: [PERMISSIONS.USERS_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Roles',
        icon: 'Shield',
        href: '/admin/roles',
        requiredPermissions: [PERMISSIONS.ROLES_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Permissions',
        icon: 'KeyRound',
        href: '/admin/rbac/permissions',
        requiredPermissions: [PERMISSIONS.PERMISSIONS_READ],
        navGroup: 'Admin',
    },
    // Org
    {
        label: 'Branches',
        icon: 'Building2',
        href: '/admin/org/branches',
        requiredPermissions: [PERMISSIONS.BRANCHES_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Departments',
        icon: 'Briefcase',
        href: '/admin/org/departments',
        requiredPermissions: [PERMISSIONS.DEPARTMENTS_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Units',
        icon: 'Boxes',
        href: '/admin/org/units',
        requiredPermissions: [PERMISSIONS.UNITS_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Job Roles',
        icon: 'BadgeCheck',
        href: '/admin/org/job-roles',
        requiredPermissions: [PERMISSIONS.JOB_ROLES_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Store Locations',
        icon: 'Map',
        href: '/admin/org/store-locations',
        requiredPermissions: [PERMISSIONS.STORE_LOCATIONS_READ],
        navGroup: 'Admin',
    },
    // Catalog
    {
        label: 'Items',
        icon: 'Package',
        href: '/admin/catalog/items',
        requiredPermissions: [PERMISSIONS.ITEMS_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Categories',
        icon: 'LayoutGrid',
        href: '/admin/catalog/categories',
        requiredPermissions: [PERMISSIONS.CATEGORIES_READ],
        navGroup: 'Admin',
    },
    {
        label: 'Code Registry',
        icon: 'Tags',
        href: '/admin/catalog/reason-codes',
        requiredPermissions: [PERMISSIONS.REASON_CODES_READ],
        navGroup: 'Admin',
    },
    // Workflow & Meta
    {
        label: 'Lookups Registry',
        icon: 'Sliders',
        href: '/admin/lookups',
        requiredPermissions: [],
        anyPermissions: [PERMISSIONS.LOOKUPS_READ, PERMISSIONS.LOOKUPS_MANAGE],
        navGroup: 'Admin',
    },
    {
        label: 'Workflow Templates',
        icon: 'Settings2',
        href: '/admin/templates',
        requiredPermissions: [],
        anyPermissions: [PERMISSIONS.TEMPLATES_READ, PERMISSIONS.TEMPLATES_MANAGE],
        navGroup: 'Admin',
    },
];

// Helpers

export function hasAll(userPerms: Permission[], requiredPerms: Permission[]): boolean {
    if (requiredPerms.length === 0) return true;
    return requiredPerms.every((p) => userPerms.includes(p));
}

export function hasAny(userPerms: Permission[], anyPerms: Permission[]): boolean {
    if (!anyPerms || anyPerms.length === 0) return true;
    return anyPerms.some((p) => userPerms.includes(p));
}

export function canAccessRoute(userPerms: Permission[], routeHref: string): boolean {
    const route = APP_ROUTES.find((r) => r.href === routeHref);
    if (!route) return true;

    // SuperAdmin bypass
    // if (userPerms.includes('super_admin')) return true;

    // Check required (ALL)
    const accessRequired = hasAll(userPerms, route.requiredPermissions);

    // Check any (ONE OF) if defined
    const accessAny = route.anyPermissions ? hasAny(userPerms, route.anyPermissions) : true;

    return accessRequired && accessAny;
}
