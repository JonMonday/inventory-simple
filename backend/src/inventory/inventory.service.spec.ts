import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
    let service: InventoryService;
    let prisma: PrismaService;

    const mockItem = { id: 'item1', unitOfMeasure: 'UNIT' };
    const mockReasonCode = {
        id: 'rc1',
        code: 'RC1',
        isActive: true,
        allowedMovements: [{ movementType: 'RECEIVE' }, { movementType: 'ISSUE' }]
    };

    const mockTx = {
        item: { findUnique: jest.fn() },
        reasonCode: { findUnique: jest.fn() },
        inventoryLedger: { create: jest.fn() },
        stockSnapshot: { upsert: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
    } as any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                { provide: PrismaService, useValue: {} },
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);
    });

    describe('recordMovement', () => {
        it('should successfully record a RECEIVE movement', async () => {
            mockTx.item.findUnique.mockResolvedValue(mockItem);
            mockTx.reasonCode.findUnique.mockResolvedValue(mockReasonCode);

            await service.recordMovement(mockTx, {
                itemId: 'item1',
                locationId: 'loc1',
                movementType: 'RECEIVE',
                quantity: 10,
                reasonCodeId: 'rc1',
                userId: 'user1',
            });

            expect(mockTx.inventoryLedger.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    movementType: 'RECEIVE',
                    quantity: 10,
                    toLocationId: 'loc1',
                })
            });
            expect(mockTx.stockSnapshot.upsert).toHaveBeenCalledWith(expect.objectContaining({
                update: { quantityOnHand: { increment: 10 } }
            }));
        });

        it('should throw error if reason code is not allowed for movement type', async () => {
            mockTx.item.findUnique.mockResolvedValue(mockItem);
            mockTx.reasonCode.findUnique.mockResolvedValue(mockReasonCode);

            await expect(service.recordMovement(mockTx, {
                itemId: 'item1',
                locationId: 'loc1',
                movementType: 'TRANSFER',
                quantity: 10,
                reasonCodeId: 'rc1',
                userId: 'user1',
            })).rejects.toThrow(BadRequestException);
        });

        it('should throw error if insufficient AVAILABLE stock (Reserved Stock enforcement)', async () => {
            mockTx.item.findUnique.mockResolvedValue(mockItem);
            mockTx.reasonCode.findUnique.mockResolvedValue(mockReasonCode);
            mockTx.stockSnapshot.findUnique.mockResolvedValue({
                quantityOnHand: 10,
                reservedQuantity: 8,
            });

            await expect(service.recordMovement(mockTx, {
                itemId: 'item1',
                locationId: 'loc1',
                movementType: 'ISSUE',
                quantity: 5,
                reasonCodeId: 'rc1',
                userId: 'user1',
            })).rejects.toThrow(/Insufficient available stock/);
        });

        it('should throw error if reason code requires free text but none provided', async () => {
            mockTx.item.findUnique.mockResolvedValue(mockItem);
            mockTx.reasonCode.findUnique.mockResolvedValue({
                ...mockReasonCode,
                requiresFreeText: true,
                allowedMovements: [{ movementType: 'ISSUE' }]
            });

            await expect(service.recordMovement(mockTx, {
                itemId: 'item1',
                locationId: 'loc1',
                movementType: 'ISSUE',
                quantity: 1,
                reasonCodeId: 'rc1',
                userId: 'user1',
            })).rejects.toThrow(/requires a description/);
        });
    });
});
