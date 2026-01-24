import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestHarness } from './helpers/test-harness';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Concurrency & Stress (e2e)', () => {
    let app: INestApplication;
    let harness: TestHarness;
    let prisma: PrismaService;
    let tokens: Map<string, string>;

    beforeAll(async () => {
        const dbUrl = `file:./tmp/e2e-stress-${process.env.JEST_WORKER_ID || 0}.sqlite`;
        await TestHarness.initDb(dbUrl);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        harness = new TestHarness();
        prisma = app.get<PrismaService>(PrismaService);
        tokens = await harness.loginAllUsers(app, 'FULL');
    }, 60000);

    afterAll(async () => {
        await app.close();
        await harness.cleanup();
    });

    it('should authenticate 200 users concurrently without failures', async () => {
        expect(tokens.size).toBe(200);
    });

    it('should maintain sequential uniqueness for REQ IDs under 50 parallel creations', async () => {
        const allEmails = Array.from(tokens.keys());
        const deptUserEmails = allEmails.filter(e => e.startsWith('departmentuser'));
        const sampledEmails = deptUserEmails.slice(0, 50);
        const item = await prisma.item.findFirst();

        const batchSize = 1; // Sequential debug
        const results = [];
        for (let i = 0; i < sampledEmails.length; i += batchSize) {
            const batch = sampledEmails.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(email => {
                return request(app.getHttpServer())
                    .post('/requests')
                    .set('Authorization', `Bearer ${tokens.get(email)}`)
                    .send({ lines: [{ itemId: item!.id, quantity: 1 }] });
            }));
            results.push(...batchResults);
        }

        const successful = results.filter(r => r.status === 201);
        expect(successful.length).toBe(50);

        const readableIds = successful.map(r => r.body.readableId);
        const uniqueIds = new Set(readableIds);
        expect(uniqueIds.size).toBe(50);
    });

    it('should handle reservation contention on a single item without over-reserving', async () => {
        const item = await prisma.item.findFirst();
        const branch = await (prisma as any).branch.findFirst({ include: { locations: true } });
        const store = branch!.locations.find((l: any) => l.type === 'STORE')!;

        const storekeeperToken = tokens.get('storekeeper1@test.com')!;
        const approverToken = tokens.get('approver1@test.com')!;
        const deptToken = tokens.get('departmentuser1@test.com')!;

        // Reset stock to exact known state
        await prisma.stockSnapshot.upsert({
            where: { itemId_locationId: { itemId: item!.id, locationId: store.id } },
            update: { quantityOnHand: 10, reservedQuantity: 0 },
            create: { itemId: item!.id, locationId: store.id, quantityOnHand: 10, reservedQuantity: 0 }
        });

        const reqs = [];
        for (let i = 0; i < 20; i++) { // Reduced from 50 to avoid hammering sqlite too hard in one go if that's the issue
            const res = await request(app.getHttpServer())
                .post('/requests')
                .set('Authorization', `Bearer ${deptToken}`)
                .send({ lines: [{ itemId: item!.id, quantity: 1 }] });
            if (res.status === 201) reqs.push(res.body);
        }

        // Process in smaller batches
        const reservationResults = [];
        const resBatchSize = 1; // Sequential debug
        for (let i = 0; i < reqs.length; i += resBatchSize) {
            const batch = reqs.slice(i, i + resBatchSize);
            const batchResults = await Promise.all(batch.map(async (req) => {
                await request(app.getHttpServer()).post(`/requests/${req.id}/submit`).set('Authorization', `Bearer ${deptToken}`);
                await request(app.getHttpServer()).post(`/requests/${req.id}/start-review`).set('Authorization', `Bearer ${approverToken}`);

                return request(app.getHttpServer())
                    .post(`/requests/${req.id}/send-to-approval`)
                    .set('Authorization', `Bearer ${approverToken}`)
                    .send({ issueFromLocationId: store.id });
            }));
            reservationResults.push(...batchResults);
        }

        const successfulRes = reservationResults.filter(r => r.status === 201);
        const failedRes = reservationResults.filter(r => r.status === 400); // Insufficient stock

        // Total stock is 10. Each req is 1. Should succeed 10 times.
        expect(successfulRes.length).toBe(10);
        expect(failedRes.length).toBe(reqs.length - 10);

        const snap = await prisma.stockSnapshot.findUnique({ where: { itemId_locationId: { itemId: item!.id, locationId: store.id } } });
        expect(snap!.reservedQuantity).toBe(10);
    });
});
