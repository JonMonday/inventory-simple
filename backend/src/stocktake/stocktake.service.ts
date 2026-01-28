import { Injectable, NotFoundException, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateStocktakeDto, SubmitStocktakeCountDto } from './dto/stocktake.dto';

@Injectable()
export class StocktakeService {
    constructor(
        private prisma: PrismaService,
        private inventoryService: InventoryService
    ) { }

    private async getStatusId(code: string) {
        const s = await this.prisma.stocktakeStatus.findUnique({ where: { code } });
        if (!s) throw new InternalServerErrorException(`Stocktake status ${code} not found`);
        return s.id;
    }

    async create(userId: string, dto: CreateStocktakeDto) {
        const statusId = await this.getStatusId('DRAFT');
        return this.prisma.stocktake.create({
            data: {
                name: dto.name,
                storeLocationId: dto.locationId,
                statusId,
                createdByUserId: userId
            }
        });
    }

    async startCounting(id: string, userId: string) {
        const countingStatusId = await this.getStatusId('COUNTING');
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({
                where: { id },
                include: { status: true }
            });
            if (!stocktake) throw new NotFoundException('Stocktake not found');
            if (stocktake.status.code !== 'DRAFT') throw new BadRequestException('Can only start counting from DRAFT status');

            const snapshots = await tx.stockSnapshot.findMany({
                where: { storeLocationId: stocktake.storeLocationId }
            });

            await tx.stocktakeLine.deleteMany({ where: { stocktakeId: id } });

            for (const snap of snapshots) {
                await tx.stocktakeLine.create({
                    data: {
                        stocktakeId: id,
                        itemId: snap.itemId,
                        systemQuantity: snap.quantityOnHand,
                        countedQuantity: null
                    }
                });
            }

            return tx.stocktake.update({
                where: { id },
                data: {
                    statusId: countingStatusId,
                    startedAt: new Date()
                },
                include: { lines: true }
            });
        });
    }

    async submitCount(id: string, userId: string, dto: SubmitStocktakeCountDto) {
        const completedStatusId = await this.getStatusId('COMPLETED');
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({
                where: { id },
                include: { status: true }
            });
            if (!stocktake) throw new NotFoundException('Stocktake not found');
            if (stocktake.status.code !== 'COUNTING') throw new BadRequestException('Stocktake must be in COUNTING status');

            for (const lineDto of dto.lines) {
                let line = await tx.stocktakeLine.findFirst({
                    where: { stocktakeId: id, itemId: lineDto.itemId }
                });

                if (!line) {
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
                data: { statusId: completedStatusId },
                include: { lines: true }
            });
        });
    }

    async approve(id: string, userId: string) {
        const statusId = await this.getStatusId('APPROVED');
        return this.prisma.stocktake.update({
            where: { id },
            data: {
                statusId,
                approvedByUserId: userId,
                approvedAt: new Date()
            }
        });
    }

    async apply(id: string, userId: string) {
        const appliedStatusId = await this.getStatusId('APPLIED');
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({
                where: { id },
                include: { lines: true, status: true }
            });
            if (!stocktake) throw new NotFoundException('Stocktake not found');
            if (stocktake.status.code !== 'APPROVED') throw new BadRequestException('Stocktake must be APPROVED before applying');

            const reasonCode = await tx.reasonCode.findFirst({
                where: { allowedMovements: { some: { ledgerMovementType: { code: 'ADJUSTMENT' } } }, isActive: true }
            });
            if (!reasonCode) throw new BadRequestException('No active ADJUSTMENT reason code found');

            for (const line of stocktake.lines) {
                if (line.variance !== 0 && line.variance !== null) {
                    await this.inventoryService.recordMovement(tx, {
                        itemId: line.itemId,
                        locationId: stocktake.storeLocationId,
                        movementType: 'ADJUSTMENT',
                        quantity: line.variance,
                        reasonCodeId: reasonCode.id,
                        userId,
                        referenceNo: `STOCKTAKE-${stocktake.name}`,
                        comments: `Variance: ${line.variance}`
                    });
                }
            }

            return tx.stocktake.update({
                where: { id },
                data: {
                    statusId: appliedStatusId,
                    completedAt: new Date()
                }
            });
        });
    }

    async findOne(id: string) {
        return this.prisma.stocktake.findUnique({
            where: { id },
            include: { lines: { include: { item: true } }, createdBy: true, storeLocation: true, status: true }
        });
    }

    async findAll() {
        return this.prisma.stocktake.findMany({
            include: { createdBy: true, storeLocation: true, status: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
