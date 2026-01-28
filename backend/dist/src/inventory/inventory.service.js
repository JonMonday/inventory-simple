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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordMovement(tx, data) {
        const item = await tx.item.findUnique({ where: { id: data.itemId } });
        if (!item)
            throw new common_1.NotFoundException(`Item not found: ${data.itemId}`);
        const mType = await tx.ledgerMovementType.findUnique({ where: { code: data.movementType } });
        if (!mType)
            throw new common_1.BadRequestException(`Invalid movement type: ${data.movementType}`);
        await tx.stockSnapshot.upsert({
            where: { itemId_storeLocationId: { itemId: data.itemId, storeLocationId: data.locationId } },
            update: { quantityOnHand: { increment: data.quantity } },
            create: { itemId: data.itemId, storeLocationId: data.locationId, quantityOnHand: data.quantity }
        });
        return tx.inventoryLedger.create({
            data: {
                itemId: data.itemId,
                [data.quantity > 0 ? 'toStoreLocationId' : 'fromStoreLocationId']: data.locationId,
                movementTypeId: mType.id,
                quantity: Math.abs(data.quantity),
                unitOfMeasure: item.unitOfMeasure,
                reasonCodeId: data.reasonCodeId,
                reasonText: data.comments,
                createdByUserId: data.userId,
                referenceNo: data.referenceNo,
            }
        });
    }
    async receive(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'RECEIVE' } });
            const results = [];
            for (const line of dto.lines) {
                const item = await tx.item.findUnique({ where: { id: line.itemId } });
                if (!item)
                    throw new common_1.NotFoundException(`Item not found: ${line.itemId}`);
                await tx.stockSnapshot.upsert({
                    where: { itemId_storeLocationId: { itemId: line.itemId, storeLocationId: dto.locationId } },
                    update: { quantityOnHand: { increment: line.quantity } },
                    create: { itemId: line.itemId, storeLocationId: dto.locationId, quantityOnHand: line.quantity }
                });
                const entry = await tx.inventoryLedger.create({
                    data: {
                        itemId: line.itemId,
                        toStoreLocationId: dto.locationId,
                        movementTypeId: movementType.id,
                        quantity: line.quantity,
                        unitOfMeasure: item.unitOfMeasure,
                        reasonCodeId: null,
                        reasonText: dto.comments,
                        createdByUserId: userId,
                        referenceNo: dto.referenceNo,
                        unitCost: line.unitCost,
                        totalCost: line.unitCost * line.quantity
                    }
                });
                results.push(entry);
            }
            return results;
        });
    }
    async returnStock(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'RECEIVE' } });
            const item = await tx.item.findUnique({ where: { id: dto.itemId } });
            if (!item)
                throw new common_1.NotFoundException('Item not found');
            await tx.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.toLocationId } },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: { itemId: dto.itemId, storeLocationId: dto.toLocationId, quantityOnHand: dto.quantity }
            });
            return tx.inventoryLedger.create({
                data: {
                    itemId: dto.itemId,
                    fromStoreLocationId: dto.fromLocationId,
                    toStoreLocationId: dto.toLocationId,
                    movementTypeId: movementType.id,
                    quantity: dto.quantity,
                    unitOfMeasure: item.unitOfMeasure,
                    reasonCodeId: dto.reasonCodeId,
                    reasonText: dto.comments,
                    createdByUserId: userId,
                }
            });
        });
    }
    async transfer(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'TRANSFER' } });
            const item = await tx.item.findUnique({ where: { id: dto.itemId } });
            if (!item)
                throw new common_1.NotFoundException('Item not found');
            const source = await tx.stockSnapshot.findUnique({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.fromStoreLocationId } }
            });
            if (!source || source.quantityOnHand < dto.quantity) {
                throw new common_1.BadRequestException('Insufficient stock for transfer');
            }
            await tx.stockSnapshot.update({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.fromStoreLocationId } },
                data: { quantityOnHand: { decrement: dto.quantity } }
            });
            await tx.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.toStoreLocationId } },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: { itemId: dto.itemId, storeLocationId: dto.toStoreLocationId, quantityOnHand: dto.quantity }
            });
            return tx.inventoryLedger.create({
                data: {
                    itemId: dto.itemId,
                    fromStoreLocationId: dto.fromStoreLocationId,
                    toStoreLocationId: dto.toStoreLocationId,
                    movementTypeId: movementType.id,
                    quantity: dto.quantity,
                    unitOfMeasure: item.unitOfMeasure,
                    reasonCodeId: dto.reasonCodeId,
                    reasonText: dto.reasonText,
                    createdByUserId: userId,
                }
            });
        });
    }
    async adjust(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'ADJUSTMENT' } });
            const item = await tx.item.findUnique({ where: { id: dto.itemId } });
            if (!item)
                throw new common_1.NotFoundException('Item not found');
            await tx.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.storeLocationId } },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: { itemId: dto.itemId, storeLocationId: dto.storeLocationId, quantityOnHand: dto.quantity }
            });
            return tx.inventoryLedger.create({
                data: {
                    itemId: dto.itemId,
                    toStoreLocationId: dto.storeLocationId,
                    movementTypeId: movementType.id,
                    quantity: dto.quantity,
                    unitOfMeasure: item.unitOfMeasure,
                    reasonCodeId: dto.reasonCodeId,
                    reasonText: dto.reasonText,
                    createdByUserId: userId,
                }
            });
        });
    }
    async findAllLedger() {
        return this.prisma.inventoryLedger.findMany({
            include: { item: true, movementType: true, fromStoreLocation: true, toStoreLocation: true, reasonCode: true, createdBy: true },
            orderBy: { createdAtUtc: 'desc' }
        });
    }
    async reverseLedgerEntry(tx, id, userId, reasonCodeId, notes) {
        const original = await tx.inventoryLedger.findUnique({
            where: { id },
            include: { movementType: true }
        });
        if (!original)
            throw new common_1.NotFoundException('Original ledger entry not found');
        const existingReversal = await tx.inventoryLedger.findFirst({ where: { reversalOfLedgerId: id } });
        if (existingReversal)
            throw new common_1.BadRequestException('Ledger entry already reversed');
        const reversalType = await tx.ledgerMovementType.findUnique({ where: { code: 'REVERSAL' } });
        if (original.toStoreLocationId) {
            await tx.stockSnapshot.update({
                where: { itemId_storeLocationId: { itemId: original.itemId, storeLocationId: original.toStoreLocationId } },
                data: { quantityOnHand: { decrement: original.quantity } }
            });
        }
        if (original.fromStoreLocationId) {
            await tx.stockSnapshot.update({
                where: { itemId_storeLocationId: { itemId: original.itemId, storeLocationId: original.fromStoreLocationId } },
                data: { quantityOnHand: { increment: original.quantity } }
            });
        }
        return tx.inventoryLedger.create({
            data: {
                itemId: original.itemId,
                fromStoreLocationId: original.toStoreLocationId,
                toStoreLocationId: original.fromStoreLocationId,
                movementTypeId: reversalType.id,
                quantity: original.quantity,
                unitOfMeasure: original.unitOfMeasure,
                reasonCodeId,
                reasonText: notes || `Reversal of entry ${original.id}`,
                createdByUserId: userId,
                referenceNo: original.referenceNo,
                reversalOfLedgerId: id
            }
        });
    }
    async findAllLocations() {
        return this.prisma.storeLocation.findMany({ include: { branch: true } });
    }
    async findAllReasonCodes() {
        return this.prisma.reasonCode.findMany();
    }
    async getLedger(filters) {
        return this.prisma.inventoryLedger.findMany({
            where: {
                itemId: filters?.itemId,
                OR: [
                    { fromStoreLocationId: filters?.storeId },
                    { toStoreLocationId: filters?.storeId }
                ]
            },
            include: { item: true, movementType: true, fromStoreLocation: true, toStoreLocation: true, reasonCode: true, createdBy: true },
            orderBy: { createdAtUtc: 'desc' }
        });
    }
    async getStockSnapshots(filters) {
        return this.prisma.stockSnapshot.findMany({
            where: {
                itemId: filters?.itemId,
                storeLocationId: filters?.storeId
            },
            include: { item: true, storeLocation: true }
        });
    }
    async getSnapshot(itemId, locId) {
        const snapshot = await this.prisma.stockSnapshot.findUnique({
            where: { itemId_storeLocationId: { itemId, storeLocationId: locId } },
            include: { item: true, storeLocation: true }
        });
        if (!snapshot)
            throw new common_1.NotFoundException('Stock snapshot not found');
        return snapshot;
    }
    async getGlobalReservations() {
        return this.prisma.reservation.findMany({
            include: {
                request: { select: { readableId: true } },
                requestLine: { include: { item: true } },
                stockSnapshot: { include: { storeLocation: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map