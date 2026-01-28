import { PrismaClient } from '@prisma/client';
import { seedStatic } from './seeders/static.seeder';
import { seedPermissions } from './seeders/permissions.seeder';
import { seedRealWorld } from './seeders/realworld.seeder';
import { createScenarios } from './seeders/scenarios';
import { log, assert } from './seeders/seed.helpers';

const prisma = new PrismaClient();

async function main() {
    const seedMode = process.env.SEED || 'all';
    log('MAIN', `Starting seed in mode: ${seedMode}`);

    try {
        if (seedMode === 'static' || seedMode === 'all') {
            await seedPermissions(prisma);
            await seedStatic(prisma);
        }

        if (seedMode === 'real' || seedMode === 'all') {
            await seedRealWorld(prisma);
            await createScenarios(prisma);
        }

        // FINAL GLOBAL VALIDATION
        log('MAIN', 'Running global system validation check...');

        // 1. Entity Counts
        const counts = {
            departments: await prisma.department.count(),
            roles: await prisma.role.count(),
            items: await prisma.item.count(),
            users: await prisma.user.count(),
            templates: await prisma.requestTemplate.count(),
            locations: await prisma.storeLocation.count(),
            requests: await prisma.request.count()
        };

        log('MAIN', `Entity Counts: ${JSON.stringify(counts)}`);

        assert(counts.departments >= 8, 'Organizational structure missing');
        assert(counts.roles >= 8, 'RBAC roles missing');
        assert(counts.items >= 40, 'Inventory catalog incomplete');
        assert(counts.locations >= 2, 'Store network missing');
        assert(counts.requests >= 8, 'Workflow scenarios missing');

        // 2. Stock Invariants
        const stock = await prisma.stockSnapshot.findMany();
        for (const s of stock) {
            assert(s.quantityOnHand >= 0, `Negative stock on item ${s.itemId}`);
            assert(s.reservedQuantity >= 0, `Negative reservation on item ${s.itemId}`);
            assert(s.reservedQuantity <= s.quantityOnHand, `Reservation overflow on item ${s.itemId}`);
        }

        log('MAIN', 'All system invariants verified successfully.');
        log('MAIN', 'READY: run with SEED=static|real|all');

    } catch (e) {
        console.error('[SEED ERROR]', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
