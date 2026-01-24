import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Inventory & Reports (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        // Login as admin
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'superadmin1@test.com', password: 'Passw0rd!' });

        authToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('RBAC & Permissions', () => {
        it('should return 401 when user lacks token', async () => {
            await request(app.getHttpServer())
                .post('/users')
                .send({})
                .expect(401);
        });
    });

    describe('Inventory Operations & Reports', () => {
        let itemId: string;
        let locId: string;

        beforeAll(async () => {
            const items = await request(app.getHttpServer())
                .get('/items')
                .set('Authorization', `Bearer ${authToken}`);

            if (items.status !== 200) {
                console.log('Items Request Failed:', items.status, items.body);
            }
            itemId = items.body[0]?.id;

            const locs = await request(app.getHttpServer())
                .get('/reports/stock-on-hand')
                .set('Authorization', `Bearer ${authToken}`);

            if (locs.status !== 200) {
                console.log('Locs Request Failed:', locs.status, locs.body);
            }
            locId = locs.body[0]?.locationId;
        });

        it('should return 400 when reason code is not allowed for movement type or invalid input', async () => {
            await request(app.getHttpServer())
                .post('/inventory/receive')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    locationId: locId,
                    lines: [{ itemId, quantity: -10 }], // Negative qty for Receive is invalid
                    comments: 'Test'
                })
                .expect(400);
        });

        it('should export stock-on-hand as CSV', async () => {
            const res = await request(app.getHttpServer())
                .get('/reports/stock-on-hand?export=csv')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.header['content-type']).toContain('text/csv');
            expect(res.header['content-disposition']).toContain('attachment; filename="stock-on-hand.csv"');
        });

        it('should support pagination on movements', async () => {
            await request(app.getHttpServer())
                .get('/reports/movements?take=5&skip=0')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
        });
    });
});
