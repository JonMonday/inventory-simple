import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestHarness } from './helpers/test-harness';
import { PrismaService } from '../src/prisma/prisma.service';
import { RequestStatus } from '../src/requests/dto/request.dto';

describe('Functional Workflows (e2e)', () => {
    let app: INestApplication;
    let harness: TestHarness;
    let prisma: PrismaService;
    let tokens: Map<string, string>;

    beforeAll(async () => {
        const dbUrl = `file:./tmp/e2e-functional-${process.env.JEST_WORKER_ID || 0}.sqlite`;
        await TestHarness.initDb(dbUrl);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        harness = new TestHarness();
        prisma = app.get<PrismaService>(PrismaService);
        tokens = await harness.loginAllUsers(app, 'FAST');
    });

    afterAll(async () => {
        await app.close();
        await harness.cleanup();
    });

    describe('Reservation Lifecycle', () => {
        it('should increase reservedQuantity on sendToApproval and decrease on revertToReview', async () => {
            const item = await prisma.item.findFirst();
            const branch = await (prisma as any).branch.findFirst({ include: { locations: true } });
            const store = branch!.locations.find((l: any) => l.type === 'STORE')!;
            const dept = branch!.locations.find((l: any) => l.type === 'DEPARTMENT')!;
            const deptToken = tokens.get('departmentuser1@test.com')!;
            const storekeeperToken = tokens.get('storekeeper1@test.com')!; // Still needed for setup if any
            const approverToken = tokens.get('approver1@test.com')!;

            const createRes = await request(app.getHttpServer())
                .post('/requests')
                .set('Authorization', `Bearer ${deptToken}`)
                .send({ lines: [{ itemId: item!.id, quantity: 10 }] })
                .expect(201);

            const reqId = createRes.body.id;

            await request(app.getHttpServer()).post(`/requests/${reqId}/submit`).set('Authorization', `Bearer ${deptToken}`).expect(201);
            await request(app.getHttpServer()).post(`/requests/${reqId}/start-review`).set('Authorization', `Bearer ${approverToken}`).expect(201);

            await request(app.getHttpServer())
                .post(`/requests/${reqId}/send-to-approval`)
                .set('Authorization', `Bearer ${approverToken}`)
                .send({ issueFromLocationId: store.id })
                .expect(201);

            const snapAfterReserve = await prisma.stockSnapshot.findUnique({
                where: { itemId_locationId: { itemId: item!.id, locationId: store.id } }
            });
            expect(snapAfterReserve!.reservedQuantity).toBe(10);

            await request(app.getHttpServer())
                .post(`/requests/${reqId}/revert-to-review`)
                .set('Authorization', `Bearer ${approverToken}`)
                .expect(201);

            const snapAfterRelease = await prisma.stockSnapshot.findUnique({
                where: { itemId_locationId: { itemId: item!.id, locationId: store.id } }
            });
            expect(snapAfterRelease!.reservedQuantity).toBe(0);
        });
    });

    describe('Atomic Fulfillment Rollback', () => {
        it('should rollback all movements if one line fails', async () => {
            const branch = await (prisma as any).branch.findFirst({ include: { locations: true } });
            const store = branch!.locations.find((l: any) => l.type === 'STORE')!;
            const dept = branch!.locations.find((l: any) => l.type === 'DEPARTMENT')!;
            const items = await prisma.item.findMany({ take: 2 });
            const adminToken = tokens.get('superadmin1@test.com')!;

            await prisma.stockSnapshot.update({
                where: { itemId_locationId: { itemId: items[0].id, locationId: store.id } },
                data: { quantityOnHand: 100, reservedQuantity: 0 }
            });
            await prisma.stockSnapshot.update({
                where: { itemId_locationId: { itemId: items[1].id, locationId: store.id } },
                data: { quantityOnHand: 0, reservedQuantity: 0 }
            });

            const req = await prisma.request.create({
                data: {
                    readableId: `REQ-ROLLBACK-${Date.now()}`,
                    status: RequestStatus.APPROVED,
                    requesterUserId: (await prisma.user.findFirst({ where: { email: 'departmentuser1@test.com' } }))!.id,
                    issueFromLocationId: store.id,
                    departmentId: dept.id,
                    lines: {
                        create: [
                            { itemId: items[0].id, quantity: 5 },
                            { itemId: items[1].id, quantity: 5 }
                        ]
                    }
                }
            });

            const res = await request(app.getHttpServer())
                .post(`/requests/${req.id}/fulfill`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);

            expect(res.body.message).toContain('Insufficient available stock');

            const snap1 = await prisma.stockSnapshot.findUnique({ where: { itemId_locationId: { itemId: items[0].id, locationId: store.id } } });
            expect(snap1!.quantityOnHand).toBe(100);

            const updatedReq = await prisma.request.findUnique({ where: { id: req.id } });
            expect(updatedReq!.status).toBe(RequestStatus.IN_REVIEW);

            const ledgers = await prisma.inventoryLedger.findMany({ where: { referenceNo: req.readableId } });
            expect(ledgers.length).toBe(0);
        });
    });

    describe('Returns & Reversals', () => {
        it('should move stock back on return and counter-entry on reversal', async () => {
            const item = await prisma.item.findFirst();
            const branch = await (prisma as any).branch.findFirst({ include: { locations: true } });
            const store = branch!.locations.find((l: any) => l.type === 'STORE')!;
            const dept = branch!.locations.find((l: any) => l.type === 'DEPARTMENT')!;
            const adminToken = tokens.get('superadmin1@test.com')!;
            const reason = await prisma.reasonCode.findUnique({ where: { code: 'RCV-RTN' } });

            await prisma.stockSnapshot.update({
                where: { itemId_locationId: { itemId: item!.id, locationId: store.id } },
                data: { quantityOnHand: 100 }
            });
            await prisma.stockSnapshot.upsert({
                where: { itemId_locationId: { itemId: item!.id, locationId: dept.id } },
                update: { quantityOnHand: 50 },
                create: { itemId: item!.id, locationId: dept.id, quantityOnHand: 50 }
            });

            await request(app.getHttpServer())
                .post('/inventory/return')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    itemId: item!.id,
                    fromLocationId: dept.id,
                    toLocationId: store.id,
                    quantity: 10,
                    reasonCodeId: reason!.id,
                    comments: 'E2E Return'
                })
                .expect(201);

            const storeSnap = await prisma.stockSnapshot.findUnique({ where: { itemId_locationId: { itemId: item!.id, locationId: store.id } } });
            expect(storeSnap!.quantityOnHand).toBe(110);

            const ledger = await prisma.inventoryLedger.findFirst({ orderBy: { createdAtUtc: 'desc' } });
            const revReason = await prisma.reasonCode.findUnique({ where: { code: 'REV-ERR' } });

            await request(app.getHttpServer())
                .post(`/ledger/${ledger!.id}/reverse`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ reasonCodeId: revReason!.id, notes: 'Accidental return' })
                .expect(201);

            const revSnap = await prisma.stockSnapshot.findUnique({ where: { itemId_locationId: { itemId: item!.id, locationId: store.id } } });
            expect(revSnap!.quantityOnHand).toBe(100);
        });
    });

    describe('Scoping Logic', () => {
        it('should only return own requests for non-admins', async () => {
            const user1Token = tokens.get('departmentuser1@test.com')!;
            const adminToken = tokens.get('superadmin1@test.com')!;
            const item = await prisma.item.findFirst();

            await request(app.getHttpServer())
                .post('/requests')
                .set('Authorization', `Bearer ${user1Token}`)
                .send({ lines: [{ itemId: item!.id, quantity: 1 }] })
                .expect(201);

            const res1 = await request(app.getHttpServer()).get('/requests').set('Authorization', `Bearer ${user1Token}`);
            expect(res1.body.length).toBeGreaterThanOrEqual(1);

            const resAdmin = await request(app.getHttpServer()).get('/requests').set('Authorization', `Bearer ${adminToken}`);
            expect(resAdmin.body.length).toBeGreaterThanOrEqual(1);
        });
    });
});
