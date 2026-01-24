import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationService } from '../inventory/reservation.service';
import { InventoryService } from '../inventory/inventory.service';
import { RequestStatus } from './dto/request.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RequestsService', () => {
    let service: RequestsService;
    let prisma: PrismaService;
    let reservationService: ReservationService;
    let inventoryService: InventoryService;

    const mockRequest = {
        id: 'req1',
        status: RequestStatus.APPROVED,
        issueFromLocationId: 'loc-store',
        departmentId: 'dept-1',
        lines: [
            { id: 'line1', itemId: 'item1', quantity: 5 }
        ]
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequestsService,
                {
                    provide: PrismaService,
                    useValue: {
                        $transaction: jest.fn(callback => callback({
                            request: {
                                findUnique: jest.fn().mockResolvedValue(mockRequest),
                                update: jest.fn().mockResolvedValue({}),
                                findMany: jest.fn(),
                            },
                            reasonCode: { findFirst: jest.fn().mockResolvedValue({ id: 'rc1' }) },
                            requestLine: { update: jest.fn() }
                        })),
                        request: { update: jest.fn().mockResolvedValue({}) }
                    },
                },
                {
                    provide: ReservationService,
                    useValue: {
                        reserve: jest.fn(),
                        release: jest.fn(),
                        commit: jest.fn(),
                    },
                },
                {
                    provide: InventoryService,
                    useValue: {
                        recordMovement: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RequestsService>(RequestsService);
        prisma = module.get<PrismaService>(PrismaService);
        reservationService = module.get<ReservationService>(ReservationService);
        inventoryService = module.get<InventoryService>(InventoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('fulfill atomic rollback', () => {
        it('should revert to IN_REVIEW if recordMovement fails', async () => {
            // Inject failure in recordMovement
            (inventoryService.recordMovement as jest.Mock).mockRejectedValue(new Error('Low Stock'));

            await expect(service.fulfill('req1', 'user1')).rejects.toThrow('Low Stock');

            // Verify status update to IN_REVIEW happened outside the main transaction
            expect(prisma.request.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'req1' },
                data: expect.objectContaining({ status: RequestStatus.IN_REVIEW })
            }));
        });
    });

    describe('Reservation Release Triggers', () => {
        it('should release reservations on revertToReview', async () => {
            await service.revertToReview('req1', 'user1');
            expect(reservationService.release).toHaveBeenCalled();
        });

        it('should release reservations on cancel', async () => {
            await service.cancel('req1', 'user1');
            expect(reservationService.release).toHaveBeenCalled();
        });

        it('should release reservations on reject', async () => {
            await service.reject('req1', 'user1');
            expect(reservationService.release).toHaveBeenCalled();
        });
    });
});
