import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl.replace('file:', '') });
const prisma = new PrismaClient({ adapter });
const PASSWORD = 'Passw0rd!';

async function main() {
    console.log('Starting Test Seed...');

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    // 1. Roles & Permissions
    console.log('Seeding Permissions...');
    const permissions = [
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'create' },
        { resource: 'users', action: 'update' },
        { resource: 'items', action: 'read' },
        { resource: 'items', action: 'create' },
        { resource: 'items', action: 'update' },
        { resource: 'items', action: 'delete' },
        { resource: 'requests', action: 'read' },
        { resource: 'requests', action: 'create' },
        { resource: 'requests', action: 'submit' },
        { resource: 'requests', action: 'review' },
        { resource: 'requests', action: 'refactor' },
        { resource: 'requests', action: 'approve' },
        { resource: 'requests', action: 'reassign' },
        { resource: 'requests', action: 'fulfill' },
        { resource: 'ledger', action: 'create' },
        { resource: 'ledger', action: 'correct' },
        { resource: 'ledger', action: 'override' },
        { resource: 'stocktake', action: 'read' },
        { resource: 'stocktake', action: 'create' },
        { resource: 'stocktake', action: 'update' },
        { resource: 'stocktake', action: 'submit' },
        { resource: 'stocktake', action: 'approve' },
        { resource: 'stocktake', action: 'apply' },
        { resource: 'reports', action: 'view' },
    ];

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { resource_action: { resource: p.resource, action: p.action } },
            update: {},
            create: p,
        });
    }

    const allPerms = await prisma.permission.findMany();

    const roleConfigs = [
        { name: 'SuperAdmin', perms: allPerms.map(p => p.id) },
        { name: 'InventoryAdmin', perms: allPerms.filter(p => !p.resource.startsWith('users')).map(p => p.id) },
        { name: 'Storekeeper', perms: allPerms.filter(p => ['items.read', 'requests.read', 'ledger.create', 'stocktake.read', 'stocktake.update', 'stocktake.submit', 'reports.view'].includes(`${p.resource}.${p.action}`)).map(p => p.id) },
        { name: 'Approver', perms: allPerms.filter(p => ['requests.read', 'requests.review', 'requests.approve', 'stocktake.read', 'stocktake.approve', 'reports.view'].includes(`${p.resource}.${p.action}`)).map(p => p.id) },
        { name: 'DepartmentUser', perms: allPerms.filter(p => ['requests.read', 'requests.create', 'requests.submit', 'items.read', 'reports.view'].includes(`${p.resource}.${p.action}`)).map(p => p.id) },
        { name: 'Auditor', perms: allPerms.filter(p => (p.action === 'read' || p.action === 'view') && p.resource !== 'users').map(p => p.id) },
        { name: 'Viewer', perms: allPerms.filter(p => ['items.read', 'reports.view'].includes(`${p.resource}.${p.action}`)).map(p => p.id) },
    ];

    for (const rc of roleConfigs) {
        await prisma.role.upsert({
            where: { name: rc.name },
            update: {
                permissions: {
                    deleteMany: {},
                    create: rc.perms.map(pId => ({ permissionId: pId }))
                }
            },
            create: {
                name: rc.name,
                permissions: {
                    create: rc.perms.map(pId => ({ permissionId: pId }))
                }
            },
        });
    }

    const roles = await prisma.role.findMany();

    // 2. Branches & Locations
    console.log('Seeding 10 Branches and 40 Locations...');
    const branches = [];
    for (let i = 1; i <= 10; i++) {
        const code = `BR-${i.toString().padStart(3, '0')}`;
        const branch = await prisma.branch.upsert({
            where: { code },
            update: {},
            create: {
                code,
                name: `Branch ${i}`,
                locations: {
                    create: [
                        { code: `${code}-STORE`, name: `Store ${i}`, type: 'STORE' },
                        { code: `${code}-DEPT-A`, name: `Dept A - Branch ${i}`, type: 'DEPARTMENT' },
                        { code: `${code}-DEPT-B`, name: `Dept B - Branch ${i}`, type: 'DEPARTMENT' },
                        { code: `${code}-DEPT-C`, name: `Dept C - Branch ${i}`, type: 'DEPARTMENT' },
                    ]
                }
            },
            include: { locations: true }
        });
        branches.push(branch);
    }

    // 3. Reason Codes
    console.log('Seeding Reason Codes...');
    const reasonCodeConfigs = [
        { code: 'RCV-PUR', name: 'Purchase from Supplier', movements: ['RECEIVE'], requiresFreeText: false },
        { code: 'RCV-RTN', name: 'Return from Department', movements: ['RECEIVE', 'RETURN'], requiresFreeText: true },
        { code: 'ISS-REQ', name: 'Department Requisition', movements: ['ISSUE'], requiresFreeText: false },
        { code: 'ISS-DMG', name: 'Damaged/Write-off', movements: ['ISSUE', 'ADJUSTMENT'], requiresFreeText: true, requiresApproval: true, approvalThreshold: 100 },
        { code: 'TRF-INT', name: 'Internal Transfer', movements: ['TRANSFER'], requiresFreeText: false },
        { code: 'ADJ-CNT', name: 'Stocktake Adjustment', movements: ['ADJUSTMENT'], requiresFreeText: true },
        { code: 'ADJ-COR', name: 'Correction', movements: ['ADJUSTMENT'], requiresFreeText: true, requiresApproval: true, approvalThreshold: 50 },
        { code: 'REV-ERR', name: 'Data Entry Error Reversal', movements: ['REVERSAL'], requiresFreeText: true },
    ];

    for (const rc of reasonCodeConfigs) {
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

    // 4. Users (200)
    console.log('Seeding 200 Users...');
    const usersToCreate = [];

    const distributions = [
        { role: 'SuperAdmin', count: 10 },
        { role: 'InventoryAdmin', count: 20 },
        { role: 'Storekeeper', count: 50 },
        { role: 'Approver', count: 30 },
        { role: 'DepartmentUser', count: 60 },
        { role: 'Auditor', count: 20 },
        { role: 'Viewer', count: 10 },
    ];

    for (const dist of distributions) {
        const role = roles.find(r => r.name === dist.role)!;
        for (let c = 0; c < dist.count; c++) {
            const branchIndex = c % 10;
            const branch = branches[branchIndex];
            const storeLoc = branch.locations.find((l: any) => l.type === 'STORE')!;
            const deptLocs = branch.locations.filter((l: any) => l.type === 'DEPARTMENT');
            const deptLoc = deptLocs[c % 3];

            usersToCreate.push({
                email: `${dist.role.toLowerCase()}${c + 1}@test.com`,
                fullName: `${dist.role} ${c + 1}`,
                passwordHash,
                branchId: branch.id,
                locationId: storeLoc.id,
                departmentId: deptLoc.id,
                isActive: true,
                mustChangePassword: false,
                roleId: role.id
            });
        }
    }

    for (const u of usersToCreate) {
        const { roleId, ...userData } = u;
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                roles: {
                    deleteMany: {},
                    create: { roleId }
                }
            },
            create: {
                ...userData,
                roles: {
                    create: { roleId }
                }
            }
        });
    }

    // 5. Business Data
    console.log('Seeding Items and Stocks...');
    const category = await prisma.category.upsert({
        where: { name: 'Electronics' }, update: {}, create: { name: 'Electronics' }
    });
    const rcvPurReason = await prisma.reasonCode.findUnique({ where: { code: 'RCV-PUR' } })!;

    for (let i = 1; i <= 5; i++) {
        const item = await prisma.item.upsert({
            where: { code: `ITEM-${i}` },
            update: {},
            create: {
                code: `ITEM-${i}`,
                name: `Test Item ${i}`,
                categoryId: category.id,
                unitOfMeasure: 'UNIT'
            }
        });

        for (const b of branches) {
            const store = b.locations.find((l: any) => l.type === 'STORE')!;
            await prisma.stockSnapshot.upsert({
                where: { itemId_locationId: { itemId: item.id, locationId: store.id } },
                update: { quantityOnHand: 100 },
                create: { itemId: item.id, locationId: store.id, quantityOnHand: 100 }
            });

            const seededUser = await prisma.user.findFirst({ where: { email: usersToCreate[0].email } });
            // Add dummy ledger entry for reversal testing
            await prisma.inventoryLedger.create({
                data: {
                    itemId: item.id,
                    toLocationId: store.id,
                    movementType: 'RECEIVE',
                    quantity: 100,
                    reasonCodeId: rcvPurReason!.id,
                    createdByUserId: seededUser!.id,
                    unitOfMeasure: 'UNIT',
                    referenceNo: `INIT-${i}-${b.code}`,
                    comments: 'Initial Opening Balance'
                }
            });
        }
    }

    console.log('Test Seed Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
