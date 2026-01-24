"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const bcrypt = __importStar(require("bcrypt"));
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding database...');
    console.log('Creating permissions...');
    const permissions = [
        { resource: 'items', action: 'create', description: 'Create items' },
        { resource: 'items', action: 'read', description: 'View items' },
        { resource: 'items', action: 'update', description: 'Update items' },
        { resource: 'items', action: 'delete', description: 'Delete items' },
        { resource: 'ledger', action: 'create', description: 'Create ledger entries' },
        { resource: 'ledger', action: 'read', description: 'View ledger' },
        { resource: 'ledger', action: 'reverse', description: 'Reverse ledger entries' },
        { resource: 'stock', action: 'read', description: 'View stock levels' },
        { resource: 'stock', action: 'allow_negative', description: 'Allow negative stock' },
        { resource: 'stocktake', action: 'create', description: 'Create stocktakes' },
        { resource: 'stocktake', action: 'read', description: 'View stocktakes' },
        { resource: 'stocktake', action: 'update', description: 'Update stocktakes' },
        { resource: 'stocktake', action: 'complete', description: 'Complete stocktakes' },
        { resource: 'stocktake', action: 'startCount', description: 'Start stocktake count' },
        { resource: 'stocktake', action: 'submitCount', description: 'Submit stocktake counts' },
        { resource: 'stocktake', action: 'approve', description: 'Approve stocktake' },
        { resource: 'stocktake', action: 'apply', description: 'Apply stocktake' },
        { resource: 'inventory', action: 'receive', description: 'Receive stock' },
        { resource: 'inventory', action: 'return', description: 'Return stock' },
        { resource: 'inventory', action: 'adjust', description: 'Adjust inventory' },
        { resource: 'inventory', action: 'adjust.over_threshold', description: 'Adjust inventory over threshold' },
        { resource: 'users', action: 'create', description: 'Create users' },
        { resource: 'users', action: 'read', description: 'View users' },
        { resource: 'users', action: 'update', description: 'Update users' },
        { resource: 'users', action: 'delete', description: 'Delete users' },
        { resource: 'roles', action: 'create', description: 'Create roles' },
        { resource: 'roles', action: 'read', description: 'View roles' },
        { resource: 'roles', action: 'update', description: 'Update roles' },
        { resource: 'roles', action: 'delete', description: 'Delete roles' },
        { resource: 'roles', action: 'assign', description: 'Assign roles to users' },
        { resource: 'reports', action: 'read', description: 'View reports' },
        { resource: 'reports', action: 'export', description: 'Export reports' },
        { resource: 'forecasting', action: 'create', description: 'Create forecasts' },
        { resource: 'forecasting', action: 'read', description: 'View forecasts' },
        { resource: 'import', action: 'create', description: 'Import data' },
        { resource: 'import', action: 'read', description: 'View import jobs' },
        { resource: 'settings', action: 'read', description: 'View settings' },
        { resource: 'settings', action: 'update', description: 'Update settings' },
        { resource: 'audit', action: 'read', description: 'View audit logs' },
        { resource: 'requests', action: 'read', description: 'View requests' },
        { resource: 'requests', action: 'submit', description: 'Submit requests' },
        { resource: 'requests', action: 'review.start', description: 'Start request review' },
        { resource: 'requests', action: 'refactor', description: 'Refactor requests' },
        { resource: 'requests', action: 'sendToApproval', description: 'Send request to approval' },
        { resource: 'requests', action: 'approve', description: 'Approve requests' },
        { resource: 'requests', action: 'reject', description: 'Reject requests' },
        { resource: 'requests', action: 'fulfill', description: 'Fulfill requests' },
        { resource: 'requests', action: 'reassign', description: 'Reassign requests' },
        { resource: 'requests', action: 'cancel', description: 'Cancel requests' },
        { resource: 'reports', action: 'view', description: 'View all reports' },
        { resource: 'reports', action: 'export', description: 'Export reports' },
    ];
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { resource_action: { resource: perm.resource, action: perm.action } },
            update: {},
            create: perm,
        });
    }
    console.log('Creating roles...');
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'SuperAdmin' },
        update: {},
        create: {
            name: 'SuperAdmin',
            description: 'Full system access',
            isSystemRole: true,
        },
    });
    const inventoryAdminRole = await prisma.role.upsert({
        where: { name: 'InventoryAdmin' },
        update: {},
        create: {
            name: 'InventoryAdmin',
            description: 'Manage inventory, items, and stock',
            isSystemRole: true,
        },
    });
    const storekeeperRole = await prisma.role.upsert({
        where: { name: 'Storekeeper' },
        update: {},
        create: {
            name: 'Storekeeper',
            description: 'Receive, issue, and transfer stock',
            isSystemRole: true,
        },
    });
    const departmentUserRole = await prisma.role.upsert({
        where: { name: 'DepartmentUser' },
        update: {},
        create: {
            name: 'DepartmentUser',
            description: 'Request and view stock for department',
            isSystemRole: true,
        },
    });
    const auditorRole = await prisma.role.upsert({
        where: { name: 'Auditor' },
        update: {},
        create: {
            name: 'Auditor',
            description: 'View-only access to all data and audit logs',
            isSystemRole: true,
        },
    });
    const viewerRole = await prisma.role.upsert({
        where: { name: 'Viewer' },
        update: {},
        create: {
            name: 'Viewer',
            description: 'Read-only access to inventory',
            isSystemRole: true,
        },
    });
    console.log('Assigning permissions to roles...');
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: perm.id,
            },
        });
    }
    const inventoryAdminPerms = await prisma.permission.findMany({
        where: {
            OR: [
                { resource: 'items' },
                { resource: 'ledger' },
                { resource: 'stock' },
                { resource: 'stocktake' },
                { resource: 'inventory' },
                { resource: 'reports' },
            ],
        },
    });
    for (const perm of inventoryAdminPerms) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: inventoryAdminRole.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                roleId: inventoryAdminRole.id,
                permissionId: perm.id,
            },
        });
    }
    const storekeeperPerms = await prisma.permission.findMany({
        where: {
            OR: [
                { resource: 'items', action: 'read' },
                { resource: 'ledger', action: 'create' },
                { resource: 'ledger', action: 'read' },
                { resource: 'stock', action: 'read' },
                { resource: 'stocktake' },
                { resource: 'inventory' },
                { resource: 'reports', action: 'read' },
            ],
        },
    });
    for (const perm of storekeeperPerms) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: storekeeperRole.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                roleId: storekeeperRole.id,
                permissionId: perm.id,
            },
        });
    }
    const viewerPerms = await prisma.permission.findMany({
        where: {
            action: 'read',
            resource: { in: ['items', 'stock', 'reports'] },
        },
    });
    for (const perm of viewerPerms) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: viewerRole.id,
                    permissionId: perm.id,
                },
            },
            update: {},
            create: {
                roleId: viewerRole.id,
                permissionId: perm.id,
            },
        });
    }
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@inventory.com' },
        update: {},
        create: {
            email: 'admin@inventory.com',
            passwordHash: hashedPassword,
            fullName: 'System Administrator',
            isActive: true,
        },
    });
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: adminUser.id,
                roleId: superAdminRole.id,
            },
        },
        update: {},
        create: {
            userId: adminUser.id,
            roleId: superAdminRole.id,
        },
    });
    console.log('Creating demo user...');
    const demoPassword = await bcrypt.hash('password123', 10);
    const demoUser = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            passwordHash: demoPassword,
            fullName: 'Demo User',
            isActive: true,
        },
    });
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: demoUser.id,
                roleId: superAdminRole.id,
            },
        },
        update: {},
        create: {
            userId: demoUser.id,
            roleId: superAdminRole.id,
        },
    });
    console.log('Creating categories...');
    const electronics = await prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: { name: 'Electronics', description: 'Electronic items and equipment' },
    });
    const furniture = await prisma.category.upsert({
        where: { name: 'Furniture' },
        update: {},
        create: { name: 'Furniture', description: 'Office and general furniture' },
    });
    const officeSupplies = await prisma.category.upsert({
        where: { name: 'Office Supplies' },
        update: {},
        create: { name: 'Office Supplies', description: 'Stationery and office consumables' },
    });
    console.log('Creating branches...');
    const mainBranch = await prisma.branch.upsert({
        where: { code: 'MAIN' },
        update: {},
        create: {
            code: 'MAIN',
            name: 'Main Branch',
            isActive: true,
        },
    });
    console.log('Creating locations...');
    const mainStore = await prisma.location.upsert({
        where: { code: 'STORE-MAIN' },
        update: {},
        create: {
            code: 'STORE-MAIN',
            name: 'Main Store',
            type: 'STORE',
            isActive: true,
            branchId: mainBranch.id,
        },
    });
    const warehouse = await prisma.location.upsert({
        where: { code: 'WH-001' },
        update: {},
        create: {
            code: 'WH-001',
            name: 'Main Warehouse',
            type: 'WAREHOUSE',
            isActive: true,
            branchId: mainBranch.id,
        },
    });
    const adminDept = await prisma.location.upsert({
        where: { code: 'DEPT-ADMIN' },
        update: {},
        create: {
            code: 'DEPT-ADMIN',
            name: 'Administration Department',
            type: 'DEPARTMENT',
            isActive: true,
            branchId: mainBranch.id,
        },
    });
    const itDept = await prisma.location.upsert({
        where: { code: 'DEPT-IT' },
        update: {},
        create: {
            code: 'DEPT-IT',
            name: 'IT Department',
            type: 'DEPARTMENT',
            isActive: true,
            branchId: mainBranch.id,
        },
    });
    await prisma.user.update({
        where: { email: 'admin@inventory.com' },
        data: {
            locationId: mainStore.id,
            departmentId: adminDept.id,
        },
    });
    await prisma.user.update({
        where: { email: 'user@example.com' },
        data: {
            locationId: mainStore.id,
            departmentId: itDept.id,
        },
    });
    console.log('Creating reason codes...');
    const reasonCodes = [
        { code: 'RCV-PUR', name: 'Purchase from Supplier', movements: ['RECEIVE'], requiresFreeText: false },
        { code: 'RCV-RTN', name: 'Return from Department', movements: ['RECEIVE', 'RETURN'], requiresFreeText: true },
        { code: 'ISS-REQ', name: 'Department Requisition', movements: ['ISSUE'], requiresFreeText: false },
        { code: 'ISS-DMG', name: 'Damaged/Write-off', movements: ['ISSUE', 'ADJUSTMENT'], requiresFreeText: true, requiresApproval: true, approvalThreshold: 100 },
        { code: 'TRF-INT', name: 'Internal Transfer', movements: ['TRANSFER'], requiresFreeText: false },
        { code: 'ADJ-CNT', name: 'Stocktake Adjustment', movements: ['ADJUSTMENT'], requiresFreeText: true },
        { code: 'ADJ-COR', name: 'Correction', movements: ['ADJUSTMENT'], requiresFreeText: true, requiresApproval: true, approvalThreshold: 50 },
        { code: 'REV-ERR', name: 'Data Entry Error Reversal', movements: ['REVERSAL'], requiresFreeText: true },
    ];
    for (const rc of reasonCodes) {
        await prisma.reasonCode.upsert({
            where: { code: rc.code },
            update: {
                requiresFreeText: rc.requiresFreeText,
                requiresApproval: rc.requiresApproval,
                approvalThreshold: rc.approvalThreshold,
                allowedMovements: {
                    deleteMany: {},
                    create: rc.movements.map(m => ({ movementType: m }))
                }
            },
            create: {
                code: rc.code,
                name: rc.name,
                requiresFreeText: rc.requiresFreeText,
                requiresApproval: rc.requiresApproval,
                approvalThreshold: rc.approvalThreshold,
                allowedMovements: {
                    create: rc.movements.map(m => ({ movementType: m }))
                }
            },
        });
    }
    console.log('Creating sample items...');
    const items = [
        {
            code: 'ELEC-001',
            name: 'Laptop Computer',
            description: 'Standard office laptop',
            categoryId: electronics.id,
            unitOfMeasure: 'UNIT',
            reorderLevel: 5,
            reorderQuantity: 10,
        },
        {
            code: 'ELEC-002',
            name: 'Monitor 24"',
            description: '24-inch LED monitor',
            categoryId: electronics.id,
            unitOfMeasure: 'UNIT',
            reorderLevel: 10,
            reorderQuantity: 20,
        },
        {
            code: 'FURN-001',
            name: 'Office Desk',
            description: 'Standard office desk',
            categoryId: furniture.id,
            unitOfMeasure: 'UNIT',
            reorderLevel: 3,
            reorderQuantity: 5,
        },
        {
            code: 'OFFI-001',
            name: 'A4 Paper (Ream)',
            description: '500 sheets A4 white paper',
            categoryId: officeSupplies.id,
            unitOfMeasure: 'REAM',
            reorderLevel: 50,
            reorderQuantity: 100,
        },
        {
            code: 'OFFI-002',
            name: 'Ballpoint Pen (Box)',
            description: 'Box of 50 blue pens',
            categoryId: officeSupplies.id,
            unitOfMeasure: 'BOX',
            reorderLevel: 20,
            reorderQuantity: 50,
        },
    ];
    for (const item of items) {
        await prisma.item.upsert({
            where: { code: item.code },
            update: {},
            create: item,
        });
    }
    console.log('Creating default branding settings...');
    await prisma.brandingSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            primaryColor: '#3b82f6',
            secondaryColor: '#8b5cf6',
            updatedByUserId: adminUser.id,
        },
    });
    console.log('✅ Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Permissions: ${permissions.length}`);
    console.log(`   - Roles: 6`);
    console.log(`   - Admin user: admin@inventory.com / admin123`);
    console.log(`   - Demo user: user@example.com / password123`);
    console.log(`   - Categories: 3`);
    console.log(`   - Locations: 4`);
    console.log(`   - Reason codes: ${reasonCodes.length}`);
    console.log(`   - Sample items: ${items.length}`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map