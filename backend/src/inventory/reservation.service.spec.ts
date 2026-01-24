import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ReservationService', () => {
    let service: ReservationService;
    let prisma: PrismaService;

    const mockTx = {
        stockSnapshot: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        reservation: {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
    } as any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationService,
                {
                    provide: PrismaService,
                    useValue: {
                        stockSnapshot: { findUnique: jest.fn() },
                    },
                },
            ],
        }).compile();

        service = module.get<ReservationService>(ReservationService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('reserve', () => {
        it('should increment reservedQuantity and create reservation record', async () => {
            mockTx.stockSnapshot.findUnique.mockResolvedValue({
                quantityOnHand: 10,
                reservedQuantity: 2,
            });

            await service.reserve(mockTx, 'line1', 'item1', 'loc1', 5);

            expect(mockTx.stockSnapshot.update).toHaveBeenCalledWith({
                where: { itemId_locationId: { itemId: 'item1', locationId: 'loc1' } },
                data: { reservedQuantity: { increment: 5 } },
            });
            expect(mockTx.reservation.create).toHaveBeenCalled();
        });

        it('should throw BadRequestException if insufficient stock', async () => {
            mockTx.stockSnapshot.findUnique.mockResolvedValue({
                quantityOnHand: 10,
                reservedQuantity: 8,
            });

            await expect(service.reserve(mockTx, 'line1', 'item1', 'loc1', 5))
                .rejects.toThrow(BadRequestException);
        });
    });

    describe('commit', () => {
        it('should decrement reservedQuantity and delete reservation record', async () => {
            mockTx.reservation.findUnique.mockResolvedValue({
                id: 'res1',
                itemId: 'item1',
                locationId: 'loc1',
                quantity: 5,
            });

            await service.commit(mockTx, 'line1');

            expect(mockTx.stockSnapshot.update).toHaveBeenCalledWith({
                where: { itemId_locationId: { itemId: 'item1', locationId: 'loc1' } },
                data: { reservedQuantity: { decrement: 5 } },
            });
            expect(mockTx.reservation.delete).toHaveBeenCalledWith({
                where: { id: 'res1' },
            });
        });
    });
});
