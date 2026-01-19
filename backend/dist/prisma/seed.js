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
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
        { resource: 'ledger', action: 'correct', description: 'Correct ledger entries' },
        { resource: 'stock', action: 'read', description: 'View stock levels' },
        { resource: 'stock', action: 'allow_negative', description: 'Allow negative stock' },
        { resource: 'stocktakes', action: 'create', description: 'Create stocktakes' },
        { resource: 'stocktakes', action: 'read', description: 'View stocktakes' },
        { resource: 'stocktakes', action: 'update', description: 'Update stocktakes' },
        { resource: 'stocktakes', action: 'complete', description: 'Complete stocktakes' },
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
                { resource: 'stocktakes' },
                { resource: 'reports' },
                { resource: 'forecasting' },
                { resource: 'import' },
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
                { resource: 'stocktakes' },
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
    console.log('Creating locations...');
    const mainStore = await prisma.location.upsert({
        where: { code: 'STORE-MAIN' },
        update: {},
        create: {
            code: 'STORE-MAIN',
            name: 'Main Store',
            type: 'STORE',
            isActive: true,
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
        },
    });
    console.log('Creating reason codes...');
    const reasonCodes = [
        { code: 'RCV-PUR', name: 'Purchase from Supplier', movementType: 'RECEIVE' },
        { code: 'RCV-RTN', name: 'Return from Department', movementType: 'RECEIVE' },
        { code: 'ISS-REQ', name: 'Department Requisition', movementType: 'ISSUE' },
        { code: 'ISS-DMG', name: 'Damaged/Write-off', movementType: 'ISSUE' },
        { code: 'TRF-INT', name: 'Internal Transfer', movementType: 'TRANSFER' },
        { code: 'ADJ-CNT', name: 'Stocktake Adjustment', movementType: 'ADJUSTMENT' },
        { code: 'ADJ-COR', name: 'Correction', movementType: 'ADJUSTMENT' },
    ];
    for (const rc of reasonCodes) {
        await prisma.reasonCode.upsert({
            where: { code: rc.code },
            update: {},
            create: rc,
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