"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const static_seeder_1 = require("./seeders/static.seeder");
const permissions_seeder_1 = require("./seeders/permissions.seeder");
const realworld_seeder_1 = require("./seeders/realworld.seeder");
const scenarios_1 = require("./seeders/scenarios");
const seed_helpers_1 = require("./seeders/seed.helpers");
const prisma = new client_1.PrismaClient();
async function main() {
    const seedMode = process.env.SEED || 'all';
    (0, seed_helpers_1.log)('MAIN', `Starting seed in mode: ${seedMode}`);
    try {
        if (seedMode === 'static' || seedMode === 'all') {
            await (0, permissions_seeder_1.seedPermissions)(prisma);
            await (0, static_seeder_1.seedStatic)(prisma);
        }
        if (seedMode === 'real' || seedMode === 'all') {
            await (0, realworld_seeder_1.seedRealWorld)(prisma);
            await (0, scenarios_1.createScenarios)(prisma);
        }
        (0, seed_helpers_1.log)('MAIN', 'Running global system validation check...');
        const counts = {
            departments: await prisma.department.count(),
            roles: await prisma.role.count(),
            items: await prisma.item.count(),
            users: await prisma.user.count(),
            templates: await prisma.requestTemplate.count(),
            locations: await prisma.storeLocation.count(),
            requests: await prisma.request.count()
        };
        (0, seed_helpers_1.log)('MAIN', `Entity Counts: ${JSON.stringify(counts)}`);
        (0, seed_helpers_1.assert)(counts.departments >= 8, 'Organizational structure missing');
        (0, seed_helpers_1.assert)(counts.roles >= 8, 'RBAC roles missing');
        (0, seed_helpers_1.assert)(counts.items >= 40, 'Inventory catalog incomplete');
        (0, seed_helpers_1.assert)(counts.locations >= 2, 'Store network missing');
        (0, seed_helpers_1.assert)(counts.requests >= 8, 'Workflow scenarios missing');
        const stock = await prisma.stockSnapshot.findMany();
        for (const s of stock) {
            (0, seed_helpers_1.assert)(s.quantityOnHand >= 0, `Negative stock on item ${s.itemId}`);
            (0, seed_helpers_1.assert)(s.reservedQuantity >= 0, `Negative reservation on item ${s.itemId}`);
            (0, seed_helpers_1.assert)(s.reservedQuantity <= s.quantityOnHand, `Reservation overflow on item ${s.itemId}`);
        }
        (0, seed_helpers_1.log)('MAIN', 'All system invariants verified successfully.');
        (0, seed_helpers_1.log)('MAIN', 'READY: run with SEED=static|real|all');
    }
    catch (e) {
        console.error('[SEED ERROR]', e);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=seed.js.map