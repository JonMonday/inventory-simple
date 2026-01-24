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
        const validMovements = ['RECEIVE', 'ISSUE', 'ADJUSTMENT', 'TRANSFER', 'REVERSAL', 'RETURN'];
        if (!validMovements.includes(data.movementType))
            throw new common_1.BadRequestException(`Invalid movement type: ${data.movementType}`);
        if (data.movementType !== 'REVERSAL' && data.movementType !== 'ADJUSTMENT' && data.quantity <= 0)
            throw new common_1.BadRequestException('Quantity must be positive');
        const item = await tx.item.findUnique({ where: { id: data.itemId } });
        if (!item)
            throw new common_1.BadRequestException(`Item ${data.itemId} not found`);
        const reasonCode = await tx.reasonCode.findUnique({
            where: { id: data.reasonCodeId },
            include: { allowedMovements: true }
        });
        if (!reasonCode)
            throw new common_1.BadRequestException(`Reason Code ${data.reasonCodeId} not found`);
        if (!reasonCode.isActive)
            throw new common_1.BadRequestException(`Reason Code ${data.reasonCodeId} is not active`);
        const isAllowed = reasonCode.allowedMovements.some((m) => m.movementType === data.movementType);
        if (!isAllowed) {
            throw new common_1.BadRequestException(`Reason Code ${reasonCode.code} is not permitted for movement type ${data.movementType}`);
        }
        await this.validateReasonPolicy(tx, reasonCode, Math.abs(data.quantity), data.unitCost || 0, data.userId, data.reasonText);
        const ledgerData = {
            itemId: data.itemId,
            movementType: data.movementType,
            quantity: Math.abs(data.quantity),
            unitOfMeasure: item.unitOfMeasure,
            reasonCodeId: data.reasonCodeId,
            reasonText: data.reasonText,
            referenceNo: data.referenceNo,
            comments: data.comments,
            createdByUserId: data.userId,
            unitCost: data.unitCost,
            totalCost: data.unitCost ? data.unitCost * Math.abs(data.quantity) : undefined,
            source: 'API',
            reversalOfLedgerId: data.reversalOfLedgerId
        };
        let increment = 0;
        if (data.movementType === 'RECEIVE') {
            ledgerData.toLocationId = data.locationId;
            ledgerData.fromLocationId = data.relatedLocationId;
            increment = data.quantity;
        }
        else if (data.movementType === 'ISSUE') {
            ledgerData.fromLocationId = data.locationId;
            ledgerData.toLocationId = data.relatedLocationId;
            increment = -data.quantity;
        }
        else if (data.movementType === 'ADJUSTMENT' || data.movementType === 'REVERSAL') {
            increment = data.quantity;
            if (increment > 0) {
                ledgerData.toLocationId = data.locationId;
            }
            else {
                ledgerData.fromLocationId = data.locationId;
            }
        }
        else if (data.movementType === 'RETURN') {
            ledgerData.toLocationId = data.locationId;
            ledgerData.fromLocationId = data.relatedLocationId;
            increment = data.quantity;
        }
        else if (data.movementType === 'TRANSFER') {
            if (!data.relatedLocationId)
                throw new common_1.BadRequestException('Transfer requires relatedLocationId (source)');
            ledgerData.toLocationId = data.locationId;
            ledgerData.fromLocationId = data.relatedLocationId;
            increment = data.quantity;
            await tx.stockSnapshot.update({
                where: { itemId_locationId: { itemId: data.itemId, locationId: data.relatedLocationId } },
                data: { quantityOnHand: { decrement: data.quantity } },
            });
        }
        const ledger = await tx.inventoryLedger.create({ data: ledgerData });
        if (data.movementType === 'ISSUE' || data.movementType === 'TRANSFER' || (data.movementType === 'ADJUSTMENT' && increment < 0)) {
            const locId = (data.movementType === 'TRANSFER') ? data.relatedLocationId : data.locationId;
            const snap = await tx.stockSnapshot.findUnique({
                where: { itemId_locationId: { itemId: data.itemId, locationId: locId } }
            });
            if (snap) {
                const available = snap.quantityOnHand - snap.reservedQuantity;
                if (available < Math.abs(increment)) {
                    throw new common_1.BadRequestException(`Insufficient available stock at location ${locId}. OnHand: ${snap.quantityOnHand}, Reserved: ${snap.reservedQuantity}, Available: ${available}, Requested: ${Math.abs(increment)}`);
                }
            }
        }
        await tx.stockSnapshot.upsert({
            where: { itemId_locationId: { itemId: data.itemId, locationId: data.locationId } },
            update: { quantityOnHand: { increment: increment } },
            create: {
                itemId: data.itemId,
                locationId: data.locationId,
                quantityOnHand: increment > 0 ? increment : 0,
            },
        });
        return ledger;
    }
    async reverseLedgerEntry(tx, ledgerId, userId, reasonCodeId, notes) {
        const original = await tx.inventoryLedger.findUnique({ where: { id: ledgerId } });
        if (!original)
            throw new common_1.NotFoundException('Original ledger entry not found');
        if (original.reversalOfLedgerId)
            throw new common_1.BadRequestException('Cannot reverse a reversal');
        const existingReversal = await tx.inventoryLedger.findFirst({ where: { reversalOfLedgerId: ledgerId } });
        if (existingReversal)
            throw new common_1.BadRequestException('Ledger entry already reversed');
        let quantity = 0;
        let locationId = '';
        if (original.movementType === 'RECEIVE') {
            locationId = original.toLocationId;
            quantity = -original.quantity;
        }
        else if (original.movementType === 'ISSUE') {
            locationId = original.fromLocationId;
            quantity = original.quantity;
        }
        else if (original.movementType === 'ADJUSTMENT') {
            if (original.toLocationId) {
                locationId = original.toLocationId;
                quantity = -original.quantity;
            }
            else {
                locationId = original.fromLocationId;
                quantity = original.quantity;
            }
        }
        else if (original.movementType === 'RETURN') {
            locationId = original.toLocationId;
            quantity = -original.quantity;
        }
        else if (original.movementType === 'TRANSFER') {
            locationId = original.fromLocationId;
            const sourceLocationId = original.toLocationId;
            await this.recordMovement(tx, {
                itemId: original.itemId,
                locationId: locationId,
                relatedLocationId: sourceLocationId,
                movementType: 'REVERSAL',
                quantity: original.quantity,
                reasonCodeId,
                reasonText: notes,
                userId,
                comments: `Reversal of Transfer ${original.referenceNo || ledgerId}. ${notes || ''}`,
                reversalOfLedgerId: ledgerId
            });
            return;
        }
        else {
            throw new common_1.BadRequestException(`Reversal not implemented for movement type ${original.movementType}`);
        }
        await this.recordMovement(tx, {
            itemId: original.itemId,
            locationId: locationId,
            movementType: 'REVERSAL',
            quantity: quantity,
            reasonCodeId,
            reasonText: notes,
            userId,
            comments: `Reversal of ${original.referenceNo || ledgerId}. ${notes || ''}`,
            reversalOfLedgerId: ledgerId
        });
    }
    async validateReasonPolicy(tx, code, quantity, unitCost, userId, text) {
        if (code.requiresFreeText && !text) {
            throw new common_1.BadRequestException(`Reason code ${code.code} requires a description/text.`);
        }
        if (code.requiresApproval && code.approvalThreshold !== null) {
            const totalValue = quantity * unitCost;
            if (totalValue > code.approvalThreshold) {
                const user = await tx.user.findUnique({
                    where: { id: userId },
                    include: {
                        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
                        permissions: { include: { permission: true } }
                    }
                });
                const hasOverride = user.roles.some((ur) => ur.role.permissions.some((rp) => rp.permission.resource === 'ledger' && rp.permission.action === 'override')) ||
                    user.permissions.some((up) => up.permission.resource === 'ledger' && up.permission.action === 'override');
                if (!hasOverride) {
                    throw new common_1.ForbiddenException(`Movement value (${totalValue}) exceeds approval threshold (${code.approvalThreshold}) for reason code ${code.code}.`);
                }
            }
        }
    }
    async receive(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const location = await tx.location.findUnique({ where: { id: dto.locationId } });
            if (!location || location.type === 'DEPARTMENT') {
                throw new common_1.BadRequestException('Cannot receive inventory into a DEPARTMENT location');
            }
            const results = [];
            for (const line of dto.lines) {
                const reasonCode = await tx.reasonCode.findFirst({
                    where: {
                        isActive: true,
                        allowedMovements: { some: { movementType: 'RECEIVE' } }
                    },
                });
                if (!reasonCode)
                    throw new common_1.BadRequestException('No active RECEIVE reason code found');
                const ledger = await this.recordMovement(tx, {
                    itemId: line.itemId,
                    locationId: dto.locationId,
                    movementType: 'RECEIVE',
                    quantity: line.quantity,
                    reasonCodeId: reasonCode.id,
                    userId,
                    comments: dto.comments,
                    referenceNo: dto.referenceNo,
                    unitCost: line.unitCost,
                });
                results.push(ledger);
            }
            return results;
        });
    }
    async returnStock(userId, data) {
        return this.prisma.$transaction(async (tx) => {
            const fromLoc = await tx.location.findUnique({ where: { id: data.fromLocationId } });
            const toLoc = await tx.location.findUnique({ where: { id: data.toLocationId } });
            if (!fromLoc || fromLoc.type !== 'DEPARTMENT') {
                throw new common_1.BadRequestException('Return must originate from a DEPARTMENT location');
            }
            if (!toLoc || (toLoc.type !== 'STORE' && toLoc.type !== 'WAREHOUSE')) {
                throw new common_1.BadRequestException('Return must be directed to a STORE or WAREHOUSE location');
            }
            return this.recordMovement(tx, {
                itemId: data.itemId,
                locationId: data.toLocationId,
                relatedLocationId: data.fromLocationId,
                movementType: 'RETURN',
                quantity: data.quantity,
                reasonCodeId: data.reasonCodeId,
                reasonText: data.comments,
                userId,
                comments: data.comments
            });
        });
    }
    async findAllLocations() {
        return this.prisma.location.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async findAllReasonCodes() {
        return this.prisma.reasonCode.findMany({
            where: { isActive: true },
            include: { allowedMovements: true },
            orderBy: { code: 'asc' },
        });
    }
    async findAllLedger(filters) {
        return this.prisma.inventoryLedger.findMany({
            where: {
                ...(filters?.itemId && { itemId: filters.itemId }),
                ...(filters?.movementType && { movementType: filters.movementType }),
                ...(filters?.locationId && {
                    OR: [
                        { fromLocationId: filters.locationId },
                        { toLocationId: filters.locationId },
                    ],
                }),
            },
            include: {
                item: true,
                fromLocation: true,
                toLocation: true,
                createdBy: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                reasonCode: true,
            },
            orderBy: {
                createdAtUtc: 'desc',
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map