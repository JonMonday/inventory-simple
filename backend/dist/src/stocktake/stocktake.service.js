"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocktakeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const inventory_service_1 = require("../inventory/inventory.service");
let StocktakeService = class StocktakeService {
    prisma;
    inventoryService;
    constructor(prisma, inventoryService) {
        this.prisma = prisma;
        this.inventoryService = inventoryService;
    }
    async getStatusId(code) {
        const s = await this.prisma.stocktakeStatus.findUnique({ where: { code } });
        if (!s)
            throw new common_1.InternalServerErrorException(`Stocktake status ${code} not found`);
        return s.id;
    }
    async create(userId, dto) {
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
    async startCounting(id, userId) {
        const countingStatusId = await this.getStatusId('COUNTING');
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({
                where: { id },
                include: { status: true }
            });
            if (!stocktake)
                throw new common_1.NotFoundException('Stocktake not found');
            if (stocktake.status.code !== 'DRAFT')
                throw new common_1.BadRequestException('Can only start counting from DRAFT status');
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
    async submitCount(id, userId, dto) {
        const completedStatusId = await this.getStatusId('COMPLETED');
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({
                where: { id },
                include: { status: true }
            });
            if (!stocktake)
                throw new common_1.NotFoundException('Stocktake not found');
            if (stocktake.status.code !== 'COUNTING')
                throw new common_1.BadRequestException('Stocktake must be in COUNTING status');
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
                }
                else {
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
    async approve(id, userId) {
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
    async apply(id, userId) {
        const appliedStatusId = await this.getStatusId('APPLIED');
        return this.prisma.$transaction(async (tx) => {
            const stocktake = await tx.stocktake.findUnique({
                where: { id },
                include: { lines: true, status: true }
            });
            if (!stocktake)
                throw new common_1.NotFoundException('Stocktake not found');
            if (stocktake.status.code !== 'APPROVED')
                throw new common_1.BadRequestException('Stocktake must be APPROVED before applying');
            const reasonCode = await tx.reasonCode.findFirst({
                where: { allowedMovements: { some: { ledgerMovementType: { code: 'ADJUSTMENT' } } }, isActive: true }
            });
            if (!reasonCode)
                throw new common_1.BadRequestException('No active ADJUSTMENT reason code found');
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
    async findOne(id) {
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
};
exports.StocktakeService = StocktakeService;
exports.StocktakeService = StocktakeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService])
], StocktakeService);
//# sourceMappingURL=stocktake.service.js.map