"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testConcurrency() {
    console.log('🚀 Starting Concurrency Test (50 parallel requests)...');
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('❌ No user found in DB. Seed first.');
        process.exit(1);
    }
    const promises = Array.from({ length: 50 }).map(async (_, i) => {
        return prisma.$transaction(async (tx) => {
            const year = new Date().getFullYear();
            const sequence = await tx.systemSequence.upsert({
                where: { name_year: { name: 'CONCURRENCY_TEST', year } },
                update: { nextValue: { increment: 1 } },
                create: { name: 'CONCURRENCY_TEST', year, nextValue: 1000 },
            });
            const readableId = `TEST-${year}-${sequence.nextValue}`;
            return readableId;
        });
    });
    const results = await Promise.allSettled(promises);
    const succeeded = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected');
    const uniqueIds = new Set(succeeded);
    console.log(`📊 Succeeded: ${succeeded.length}`);
    console.log(`📊 Failed: ${failed.length}`);
    console.log(`📊 Unique IDs: ${uniqueIds.size}`);
    if (uniqueIds.size !== succeeded.length) {
        console.error('❌ DUPLICATE IDs DETECTED!');
    }
    else if (failed.length > 0) {
        console.warn('⚠️ Some requests failed (likely due to SQLite busy). For SQLite, this is common under high concurrency without proper retry logic.');
    }
    else {
        console.log('✅ ALL IDs ARE UNIQUE!');
    }
    await prisma.$disconnect();
}
testConcurrency();
//# sourceMappingURL=test-concurrency.js.map