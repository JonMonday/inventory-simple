import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { upsertByCode, upsertByEmail, log, assert, asCode } from './seed.helpers';

export async function seedRealWorld(prisma: PrismaClient) {
    log('REAL', 'Starting real-world operational data seed...');
    const hash = await bcrypt.hash('password123', 10);

    // 1. Organizational Structure (8 Departments)
    log('REAL', 'Seeding 8-department GRA hierarchy...');
    const hq = await upsertByCode(prisma.branch, 'BANJUL_HQ', { name: 'Banjul HQ' });

    const depts = [
        { code: 'ADMIN', name: 'Administration' },
        { code: 'FINANCE', name: 'Finance' },
        { code: 'HR', name: 'Human Resources' },
        { code: 'PROC', name: 'Procurement' },
        { code: 'IT', name: 'Information Technology' },
        { code: 'OPS', name: 'Operations' },
        { code: 'REV_COMP', name: 'Revenue & Compliance' },
        { code: 'AUDIT', name: 'Audit & Risk' },
    ];

    const deptMap: Record<string, string> = {};
    const unitMap: Record<string, string> = {};
    for (const d of depts) {
        const dRec = await upsertByCode(prisma.department, d.code, { name: d.name, branchId: hq.id });
        deptMap[d.code] = dRec.id;
        const uRec = await upsertByCode(prisma.unit, `${d.code}_UNIT`, { name: `${d.name} Unit`, departmentId: dRec.id });
        unitMap[d.code] = uRec.id;

        // Unit-scoped Job Roles (Conceptual roles mapped to physical)
        const roles = ['Unit Head', 'Admin Assistant', 'Requester', 'Supervisor'];
        for (const r of roles) {
            await upsertByCode(prisma.jobRole, `${d.code}_${asCode(r)}`, { name: r, unitId: uRec.id });
        }
    }

    // 2. Store Locations
    log('REAL', 'Seeding HQ store locations...');
    const mainStore = await upsertByCode(prisma.storeLocation, 'HQ_MAIN', { name: 'Main Store - HQ', branchId: hq.id });
    const itStore = await upsertByCode(prisma.storeLocation, 'HQ_IT', { name: 'IT Sub-Store - HQ', branchId: hq.id });

    // 3. User Base Expansion (Every role covered)
    log('REAL', 'Seeding multi-role user base...');
    const roleRefs = await prisma.role.findMany();
    const getRole = (c: string) => roleRefs.find(r => r.code === c);

    const userBatch = [
        { email: 'superadmin@gra.local', name: 'Super Admin', r: 'super_admin', d: 'IT', jr: 'Supervisor' },
        { email: 'orgadmin@gra.local', name: 'Alpha OrgAdmin', r: 'org_admin', d: 'HR', jr: 'Supervisor' },
        { email: 'inventoryadmin@gra.local', name: 'Beta InvAdmin', r: 'inventory_admin', d: 'OPS', jr: 'Supervisor' },
        { email: 'storekeeper@gra.local', name: 'Pa Ousman', r: 'storekeeper', d: 'OPS', jr: 'Admin Assistant' },
        { email: 'procurement@gra.local', name: 'Isatou Njie', r: 'procurement_officer', d: 'PROC', jr: 'Supervisor' },
        { email: 'unit_head@gra.local', name: 'Modou Ceesay', r: 'unit_head', d: 'FINANCE', jr: 'Unit Head' },
        { email: 'auditor@gra.local', name: 'Musa Bah', dcode: 'AUDIT', r: 'auditor', d: 'AUDIT', jr: 'Supervisor' },
    ];

    // Specific requesters for each department
    for (const d of depts) {
        userBatch.push({
            email: `${d.code.toLowerCase()}.requester@gra.local`,
            name: `${d.name} Requester`,
            r: 'requester', d: d.code, jr: 'Requester'
        });
    }

    for (const u of userBatch) {
        const jrRec = await prisma.jobRole.findUnique({ where: { code: `${u.d}_${asCode(u.jr)}` } });
        const uRec = await upsertByEmail(prisma.user, u.email, {
            fullName: u.name, passwordHash: hash, isActive: true, branchId: hq!.id,
            departmentId: deptMap[u.d]!, unitId: unitMap[u.d]!, jobRoleId: jrRec!.id
        });
        // Role mapping
        const role = getRole(u.r);
        if (role) {
            await prisma.userRole.upsert({
                where: { userId_roleId: { userId: uRec.id, roleId: role.id } },
                update: {}, create: { userId: uRec.id, roleId: role.id }
            });
        }
    }

    // 4. Catalog (40+ items)
    log('REAL', 'Seeding 40+ item office catalog...');
    const catNames = ['Writing Instruments', 'Paper Products', 'Filing', 'Computer Accessories', 'General Stationery'];
    const cats: Record<string, string> = {};
    for (const c of catNames) {
        const cRec = await prisma.category.upsert({ where: { name: c }, update: {}, create: { name: c } });
        cats[c] = cRec.id;
    }

    const supplies = [
        { cat: 'Writing Instruments', items: ['Blue Pen', 'Black Pen', 'Red Pen', 'Pencil HB', 'Highlighter Yellow', 'Highlighter Green', 'Permanent Marker', 'Whiteboard Marker'] },
        { cat: 'Paper Products', items: ['A4 Paper Ream', 'A3 Paper Ream', 'Sticky Notes 3x3', 'Envelope DL', 'Envelope A4', 'Notebook A5', 'Notebook A4', 'Tracing Paper'] },
        { cat: 'Filing', items: ['Lever Arch File A4', 'Manilla Folder A4', 'Plastic Sleeve A4', '2D Ring Binder', 'Archive Box', 'Folder Dividers A-Z', 'Insert Binder A4', 'Clip Folder'] },
        { cat: 'Computer Accessories', items: ['USB Flash Drive 32GB', 'USB Flash Drive 64GB', 'Wireless Mouse', 'Wired Keyboard', 'Mouse Pad', 'HDMI Cable 2m', 'VGA Adapter', 'Laptop Sleeve'] },
        { cat: 'General Stationery', items: ['Medium Stapler', 'Heavy Duty Stapler', 'Staples 26/6', 'Paper Clips 33mm', 'Binder Clips 25mm', 'Clear Tape 24mm', 'Scissors 8"', 'Glue Stick 40g', 'Correction Tape', 'Ruler 30cm'] },
    ];

    const activeStatus = (await prisma.itemStatus.findUnique({ where: { code: 'ACTIVE' } }))!;
    const itemIds: string[] = [];
    for (const group of supplies) {
        for (const iName of group.items) {
            const code = `SKU-${asCode(iName)}`;
            const iRec = await prisma.item.upsert({
                where: { code },
                update: { name: iName, categoryId: cats[group.cat], statusId: activeStatus.id, unitOfMeasure: 'Each' },
                create: { code, name: iName, categoryId: cats[group.cat], statusId: activeStatus.id, unitOfMeasure: 'Each' }
            });
            itemIds.push(iRec.id);
            // Stock Snapshots (Seed both stores)
            await prisma.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: iRec.id, storeLocationId: mainStore.id } },
                update: { quantityOnHand: 500 }, create: { itemId: iRec.id, storeLocationId: mainStore.id, quantityOnHand: 500 }
            });
            await prisma.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: iRec.id, storeLocationId: itStore.id } },
                update: { quantityOnHand: 100 }, create: { itemId: iRec.id, storeLocationId: itStore.id, quantityOnHand: 100 }
            });
        }
    }

    // 5. Final Realworld Validation
    log('REAL', 'Finalizing validation...');
    assert(await prisma.department.count() >= 8, 'Expected at least 8 departments');
    assert(await prisma.item.count() >= 40, 'Expected at least 40 items');
    const snapshots = await prisma.stockSnapshot.findMany();
    for (const s of snapshots) {
        assert(s.quantityOnHand >= 0, `Negative stock invariant failure on Item ${s.itemId}`);
        assert(s.reservedQuantity <= s.quantityOnHand, `Reservation overflow invariant failure on Item ${s.itemId}`);
    }
    log('REAL', 'Real-world data seeded successfully.');
}
