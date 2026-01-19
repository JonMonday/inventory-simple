import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateStocktakeDto, SubmitStocktakeCountDto } from './dto/stocktake.dto';

@Injectable()
export class StocktakeService {
    constructor(
        private prisma: PrismaService,
        private inventoryService: InventoryService
    ) { }

    async create(userId: string, dto: CreateStocktakeDto) {
        return this.prisma.stocktake.create({
            data: {
                name: dto.name,
                locationId: dto.locationId,
                status: 'DRAFT',
                createdByUserId: userId
            }
        });
    }

    async startCounting(id: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({ where: { id } });
            if (!stocktake) throw new NotFoundException('Stocktake not found');
            if (stocktake.status !== 'DRAFT') throw new BadRequestException('Can only start counting from DRAFT status');

            // Snapshot all items in location (or allow selecting items? Assuming all for now)
            // We need to find all items that have stock in this location, OR all items in system?
            // Usually stocktake is specific. Let's assume we find all items with active snapshots in this location.
            // + items that exist but have no snapshot (0 qty).
            // For simplicity: Load all items in system and create lines? 
            // Better: Load existing snapshots for this location.

            const snapshots = await tx.stockSnapshot.findMany({
                where: { locationId: stocktake.locationId }
            });

            await tx.stocktakeLine.deleteMany({ where: { stocktakeId: id } });

            for (const snap of snapshots) {
                await tx.stocktakeLine.create({
                    data: {
                        stocktakeId: id,
                        itemId: snap.itemId,
                        systemQuantity: snap.quantityOnHand,
                        countedQuantity: null // not counted yet
                    }
                });
            }

            return tx.stocktake.update({
                where: { id },
                data: {
                    status: 'COUNTING',
                    startedAt: new Date()
                },
                include: { lines: true }
            });
        });
    }

    async submitCount(id: string, userId: string, dto: SubmitStocktakeCountDto) {
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({ where: { id } });
            if (!stocktake) throw new NotFoundException('Stocktake not found');
            if (stocktake.status !== 'COUNTING') throw new BadRequestException('Stocktake must be in COUNTING status');

            for (const lineDto of dto.lines) {
                // Find line, or if not found (maybe item had no snapshot), create it?
                // Let's assume we only count pre-existing lines for now, or allow adding lines.
                // We'll try to find existing line first.
                let line = await tx.stocktakeLine.findFirst({
                    where: { stocktakeId: id, itemId: lineDto.itemId }
                });

                if (!line) {
                    // Item was not in snapshots, so system qty is 0.
                    line = await tx.stocktakeLine.create({
                        data: {
                            stocktakeId: id,
                            itemId: lineDto.itemId,
                            systemQuantity: 0,
                            countedQuantity: lineDto.countedQuantity,
                            variance: lineDto.countedQuantity - 0,
                            notes: lineDto.notes
                        }
                    });
                } else {
                    await tx.stocktakeLine.update({
                        where: { id: line.id },
                        data: {
                            countedQuantity: lineDto.countedQuantity,
                            variance: lineDto.countedQuantity - line.systemQuantity,
                            notes: lineDto.notes
                        }
                    });
                }
            }

            return tx.stocktake.update({
                where: { id },
                data: { status: 'SUBMITTED' },
                include: { lines: true }
            });
        });
    }

    async approve(id: string, userId: string) {
        return this.prisma.stocktake.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedByUserId: userId,
                approvedAt: new Date()
            }
        });
    }

    async apply(id: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({ where: { id }, include: { lines: true } });
            if (!stocktake) throw new NotFoundException('Stocktake not found');
            if (stocktake.status !== 'APPROVED') throw new BadRequestException('Stocktake must be APPROVED before applying');

            // Find an ADJUSTMENT reason code
            const reasonCode = await tx.reasonCode.findFirst({
                where: { movementType: 'ADJUSTMENT', isActive: true }
            });
            if (!reasonCode) throw new BadRequestException('No active ADJUSTMENT reason code found');

            for (const line of stocktake.lines) {
                if (line.variance !== 0 && line.variance !== null) {
                    await this.inventoryService.recordMovement(tx, {
                        itemId: line.itemId,
                        locationId: stocktake.locationId,
                        movementType: 'ADJUSTMENT',
                        quantity: line.variance,
                        reasonCodeId: reasonCode.id,
                        userId,
                        referenceNo: `STOCKTAKE-${stocktake.name}`,
                        comments: `Variance: ${line.variance} (System: ${line.systemQuantity}, Counted: ${line.countedQuantity})`
                    });
                }
            }

            return tx.stocktake.update({
                where: { id },
                data: {
                    status: 'APPLIED',
                    completedAt: new Date()
                }
            });
        });
    }

    async findOne(id: string) {
        return this.prisma.stocktake.findUnique({
            where: { id },
            include: { lines: { include: { item: true } }, createdBy: true, location: true }
        });
    }
}
