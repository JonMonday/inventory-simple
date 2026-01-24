import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { RequestStatus } from '../src/requests/dto/request.dto';

describe('Strict Inventory Verification (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let adminToken: string;

    // Test Data
    let item: any;
    let storeLoc: any;
    let deptLoc: any;
    let rcvRtnReason: any;
    let revErrReason: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();
        prisma = app.get<PrismaService>(PrismaService);

        // Login as Admin
        const adminLogin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'superadmin1@test.com', password: 'Passw0rd!' });
        adminToken = adminLogin.body.access_token;

        // Fetch Data from DB
        item = await prisma.item.findFirst();
        storeLoc = await prisma.location.findFirst({ where: { type: 'STORE' } });
        if (!storeLoc) storeLoc = await prisma.location.findFirst({ where: { type: 'WAREHOUSE' } });
        deptLoc = await prisma.location.findFirst({ where: { type: 'DEPARTMENT' } });

        rcvRtnReason = await prisma.reasonCode.findUnique({ where: { code: 'RCV-RTN' } });
        revErrReason = await prisma.reasonCode.findUnique({ where: { code: 'REV-ERR' } });
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Returns (POST /inventory/return)', () => {
        it('should successfully return stock from Dept to Store', async () => {
            await prisma.stockSnapshot.upsert({
                where: { itemId_locationId: { itemId: item.id, locationId: storeLoc.id } },
                update: { quantityOnHand: 100 },
                create: { itemId: item.id, locationId: storeLoc.id, quantityOnHand: 100 }
            });
            await prisma.stockSnapshot.upsert({
                where: { itemId_locationId: { itemId: item.id, locationId: deptLoc.id } },
                update: { quantityOnHand: 50 },
                create: { itemId: item.id, locationId: deptLoc.id, quantityOnHand: 50 }
            });

            await request(app.getHttpServer())
                .post('/inventory/return')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    itemId: item.id,
                    fromLocationId: deptLoc.id,
                    toLocationId: storeLoc.id,
                    quantity: 10,
                    reasonCodeId: rcvRtnReason.id,
                    comments: 'Test Return'
                })
                .expect(201);

            const storeSnap = await prisma.stockSnapshot.findUnique({ where: { itemId_locationId: { itemId: item.id, locationId: storeLoc.id } } });
            expect(storeSnap!.quantityOnHand).toBe(110);
        });
    });

    describe('Policy Enforcement', () => {
        it('should fail if available stock (OnHand - Reserved) is insufficient', async () => {
            await prisma.stockSnapshot.update({
                where: { itemId_locationId: { itemId: item.id, locationId: storeLoc.id } },
                data: { quantityOnHand: 10, reservedQuantity: 8 }
            });

            const user = await prisma.user.findFirst();
            const draft = await prisma.request.create({
                data: {
                    status: RequestStatus.APPROVED,
                    requesterUserId: user!.id,
                    readableId: `TEST-ENFORCE-${Date.now()}`,
                    issueFromLocationId: storeLoc.id,
                    departmentId: deptLoc.id,
                    lines: { create: { itemId: item.id, quantity: 5 } }
                }
            });

            const res = await request(app.getHttpServer())
                .post(`/requests/${draft.id}/fulfill`)
                .set('Authorization', `Bearer ${adminToken}`);

            if (res.status !== 400) {
                console.log('Expected 400, got', res.status, res.body);
            }
            expect(res.status).toBe(400);
        });
    });

    describe('Fulfillment Rollback', () => {
        it('should rollback transaction and revert to IN_REVIEW on failure', async () => {
            const user = await prisma.user.findFirst();
            const testId = `TEST-ROLLBACK-${Date.now()}`;
            const draft = await prisma.request.create({
                data: {
                    status: RequestStatus.APPROVED,
                    requesterUserId: user!.id,
                    readableId: testId,
                    issueFromLocationId: storeLoc.id,
                    departmentId: deptLoc.id,
                    lines: {
                        create: [
                            { itemId: item.id, quantity: 1 },
                            { itemId: item.id, quantity: 99999 }
                        ]
                    }
                }
            });

            await prisma.stockSnapshot.update({
                where: { itemId_locationId: { itemId: item.id, locationId: storeLoc.id } },
                data: { quantityOnHand: 10, reservedQuantity: 0 }
            });

            await request(app.getHttpServer())
                .post(`/requests/${draft.id}/fulfill`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);

            const updated = await prisma.request.findUnique({ where: { id: draft.id } });
            expect(updated!.status).toBe(RequestStatus.IN_REVIEW);

            const ledger = await prisma.inventoryLedger.findFirst({
                where: { referenceNo: 'TEST-ROLLBACK-1' }
            });
            expect(ledger).toBeNull();
        });
    });

    describe('RBAC & Permissions', () => {
        it('should return 401 for requests without token', async () => {
            await request(app.getHttpServer())
                .get('/reports/stock-on-hand')
                .expect(401);
        });
    });
});
