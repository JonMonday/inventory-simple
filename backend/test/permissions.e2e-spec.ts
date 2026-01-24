import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestHarness } from './helpers/test-harness';
import { permissionMatrix } from './helpers/test-matrix';
import { PrismaService } from '../src/prisma/prisma.service';

describe('RBAC Permission Matrix (e2e)', () => {
    let app: INestApplication;
    let harness: TestHarness;
    let prisma: PrismaService;
    let tokens: Map<string, string>;
    let context: any = {};

    const TEST_MODE = process.env.TEST_MODE || 'FAST';

    beforeAll(async () => {
        const dbUrl = `file:./tmp/e2e-permissions-${process.env.JEST_WORKER_ID || 0}.sqlite`;
        await TestHarness.initDb(dbUrl);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        harness = new TestHarness();
        prisma = app.get<PrismaService>(PrismaService);

        tokens = await harness.loginAllUsers(app, TEST_MODE as 'FAST' | 'FULL');

        const item = await prisma.item.findFirst();
        const category = await prisma.category.findFirst();
        const store = await prisma.location.findFirst({ where: { type: 'STORE' } });
        const dept = await prisma.location.findFirst({ where: { type: 'DEPARTMENT' } });
        const rcvPurReason = await prisma.reasonCode.findUnique({ where: { code: 'RCV-PUR' } });
        const rcvRtnReason = await prisma.reasonCode.findUnique({ where: { code: 'RCV-RTN' } });
        const revErrReason = await prisma.reasonCode.findUnique({ where: { code: 'REV-ERR' } });
        const user = await prisma.user.findFirst();

        const ledger = await prisma.inventoryLedger.create({
            data: {
                itemId: item!.id,
                toLocationId: store!.id,
                movementType: 'RECEIVE',
                quantity: 10,
                unitOfMeasure: 'UNIT',
                reasonCodeId: rcvPurReason!.id,
                createdByUserId: user!.id
            }
        });

        context = {
            itemId: item!.id,
            categoryId: category!.id,
            storeId: store!.id,
            deptId: dept!.id,
            rcvPurReasonId: rcvPurReason!.id,
            rcvRtnReasonId: rcvRtnReason!.id,
            revErrReasonId: revErrReason!.id,
            ledgerId: ledger.id,
            userId: user!.id
        };
    });

    afterAll(async () => {
        await app.close();
        await harness.cleanup();
    });

    describe.each(permissionMatrix)('$method $path', (route) => {

        it('should return 401 if unauthenticated', async () => {
            if (route.path === '/auth/login') return;
            const path = route.path.replace(':id', context.ledgerId);
            const agent = request(app.getHttpServer()) as any;
            await agent[route.method.toLowerCase()](path).expect(401);
        });

        if (route.allowedRoles.length > 0) {
            it.each(route.allowedRoles)('should allow role %s (200/201)', async (roleName) => {
                const email = `${roleName.toLowerCase()}1@test.com`;
                const token = tokens.get(email);
                if (!token) {
                    if (TEST_MODE === 'FAST') return;
                    throw new Error(`Token not found for ${email}`);
                }

                let currentPath = route.path.replace(':id', context.ledgerId);

                // Special handling for deletion/reversal to ensure resource is fresh
                if (route.path.includes('reverse')) {
                    const freshLedger = await prisma.inventoryLedger.create({
                        data: {
                            itemId: context.itemId,
                            toLocationId: context.storeId,
                            movementType: 'RECEIVE',
                            quantity: 10,
                            unitOfMeasure: 'UNIT',
                            reasonCodeId: context.rcvPurReasonId,
                            createdByUserId: context.userId // Ensure userId is available in context
                        }
                    });
                    currentPath = route.path.replace(':id', freshLedger.id);
                }

                const payload = route.getPayload ? route.getPayload(context) : {};

                const agent = request(app.getHttpServer()) as any;
                const req = agent[route.method.toLowerCase()](currentPath)
                    .set('Authorization', `Bearer ${token}`);

                if (Object.keys(payload).length > 0) req.send(payload);

                const res = await req;
                expect(res.status).toBe(route.expectedSuccessStatus);
            });
        }

        if (route.deniedRoles.length > 0) {
            it.each(route.deniedRoles)('should return 403 for denied role %s', async (roleName) => {
                const email = `${roleName.toLowerCase()}1@test.com`;
                const token = tokens.get(email);
                if (!token) {
                    if (TEST_MODE === 'FAST') return;
                    throw new Error(`Token not found for ${email}`);
                }

                const path = route.path.replace(':id', context.ledgerId);
                const payload = route.getPayload ? route.getPayload(context) : {};

                const agent = request(app.getHttpServer()) as any;
                const req = agent[route.method.toLowerCase()](path)
                    .set('Authorization', `Bearer ${token}`);

                if (Object.keys(payload).length > 0) req.send(payload);

                await req.expect(403);
            });
        }
    });
});
