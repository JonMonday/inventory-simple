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
exports.seedRealWorld = seedRealWorld;
const bcrypt = __importStar(require("bcrypt"));
const seed_helpers_1 = require("./seed.helpers");
async function seedRealWorld(prisma) {
    (0, seed_helpers_1.log)('REAL', 'Starting real-world operational data seed...');
    const hash = await bcrypt.hash('password123', 10);
    (0, seed_helpers_1.log)('REAL', 'Seeding 8-department GRA hierarchy...');
    const hq = await (0, seed_helpers_1.upsertByCode)(prisma.branch, 'BANJUL_HQ', { name: 'Banjul HQ' });
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
    const deptMap = {};
    const unitMap = {};
    for (const d of depts) {
        const dRec = await (0, seed_helpers_1.upsertByCode)(prisma.department, d.code, { name: d.name, branchId: hq.id });
        deptMap[d.code] = dRec.id;
        const uRec = await (0, seed_helpers_1.upsertByCode)(prisma.unit, `${d.code}_UNIT`, { name: `${d.name} Unit`, departmentId: dRec.id });
        unitMap[d.code] = uRec.id;
        const roles = ['Unit Head', 'Admin Assistant', 'Requester', 'Supervisor'];
        for (const r of roles) {
            await (0, seed_helpers_1.upsertByCode)(prisma.jobRole, `${d.code}_${(0, seed_helpers_1.asCode)(r)}`, { name: r, unitId: uRec.id });
        }
    }
    (0, seed_helpers_1.log)('REAL', 'Seeding HQ store locations...');
    const mainStore = await (0, seed_helpers_1.upsertByCode)(prisma.storeLocation, 'HQ_MAIN', { name: 'Main Store - HQ', branchId: hq.id });
    const itStore = await (0, seed_helpers_1.upsertByCode)(prisma.storeLocation, 'HQ_IT', { name: 'IT Sub-Store - HQ', branchId: hq.id });
    (0, seed_helpers_1.log)('REAL', 'Seeding multi-role user base...');
    const roleRefs = await prisma.role.findMany();
    const getRole = (c) => roleRefs.find(r => r.code === c);
    const userBatch = [
        { email: 'superadmin@gra.local', name: 'Super Admin', r: 'super_admin', d: 'IT', jr: 'Supervisor' },
        { email: 'orgadmin@gra.local', name: 'Alpha OrgAdmin', r: 'org_admin', d: 'HR', jr: 'Supervisor' },
        { email: 'inventoryadmin@gra.local', name: 'Beta InvAdmin', r: 'inventory_admin', d: 'OPS', jr: 'Supervisor' },
        { email: 'storekeeper@gra.local', name: 'Pa Ousman', r: 'storekeeper', d: 'OPS', jr: 'Admin Assistant' },
        { email: 'procurement@gra.local', name: 'Isatou Njie', r: 'procurement_officer', d: 'PROC', jr: 'Supervisor' },
        { email: 'unit_head@gra.local', name: 'Modou Ceesay', r: 'unit_head', d: 'FINANCE', jr: 'Unit Head' },
        { email: 'auditor@gra.local', name: 'Musa Bah', dcode: 'AUDIT', r: 'auditor', d: 'AUDIT', jr: 'Supervisor' },
    ];
    for (const d of depts) {
        userBatch.push({
            email: `${d.code.toLowerCase()}.requester@gra.local`,
            name: `${d.name} Requester`,
            r: 'requester', d: d.code, jr: 'Requester'
        });
    }
    for (const u of userBatch) {
        const jrRec = await prisma.jobRole.findUnique({ where: { code: `${u.d}_${(0, seed_helpers_1.asCode)(u.jr)}` } });
        const uRec = await (0, seed_helpers_1.upsertByEmail)(prisma.user, u.email, {
            fullName: u.name, passwordHash: hash, isActive: true, branchId: hq.id,
            departmentId: deptMap[u.d], unitId: unitMap[u.d], jobRoleId: jrRec.id
        });
        const role = getRole(u.r);
        if (role) {
            await prisma.userRole.upsert({
                where: { userId_roleId: { userId: uRec.id, roleId: role.id } },
                update: {}, create: { userId: uRec.id, roleId: role.id }
            });
        }
    }
    (0, seed_helpers_1.log)('REAL', 'Seeding 40+ item office catalog...');
    const catNames = ['Writing Instruments', 'Paper Products', 'Filing', 'Computer Accessories', 'General Stationery'];
    const cats = {};
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
    const activeStatus = (await prisma.itemStatus.findUnique({ where: { code: 'ACTIVE' } }));
    const itemIds = [];
    for (const group of supplies) {
        for (const iName of group.items) {
            const code = `SKU-${(0, seed_helpers_1.asCode)(iName)}`;
            const iRec = await prisma.item.upsert({
                where: { code },
                update: { name: iName, categoryId: cats[group.cat], statusId: activeStatus.id, unitOfMeasure: 'Each' },
                create: { code, name: iName, categoryId: cats[group.cat], statusId: activeStatus.id, unitOfMeasure: 'Each' }
            });
            itemIds.push(iRec.id);
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
    (0, seed_helpers_1.log)('REAL', 'Finalizing validation...');
    (0, seed_helpers_1.assert)(await prisma.department.count() >= 8, 'Expected at least 8 departments');
    (0, seed_helpers_1.assert)(await prisma.item.count() >= 40, 'Expected at least 40 items');
    const snapshots = await prisma.stockSnapshot.findMany();
    for (const s of snapshots) {
        (0, seed_helpers_1.assert)(s.quantityOnHand >= 0, `Negative stock invariant failure on Item ${s.itemId}`);
        (0, seed_helpers_1.assert)(s.reservedQuantity <= s.quantityOnHand, `Reservation overflow invariant failure on Item ${s.itemId}`);
    }
    (0, seed_helpers_1.log)('REAL', 'Real-world data seeded successfully.');
}
//# sourceMappingURL=realworld.seeder.js.map