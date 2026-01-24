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
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReservationService = class ReservationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reserve(tx, requestLineId, itemId, locationId, quantity) {
        let snapshot = await tx.stockSnapshot.findUnique({
            where: { itemId_locationId: { itemId, locationId } },
        });
        if (!snapshot) {
            throw new common_1.BadRequestException(`No stock snapshot found for item ${itemId} at location ${locationId}`);
        }
        const available = snapshot.quantityOnHand - snapshot.reservedQuantity;
        if (available < quantity) {
            throw new common_1.BadRequestException(`Insufficient available stock. Requested: ${quantity}, Available: ${available}`);
        }
        await tx.stockSnapshot.update({
            where: { itemId_locationId: { itemId, locationId } },
            data: {
                reservedQuantity: { increment: quantity },
            },
        });
        await tx.reservation.create({
            data: {
                requestLineId,
                itemId,
                locationId,
                quantity,
            },
        });
    }
    async release(tx, requestLineId) {
        const reservation = await tx.reservation.findUnique({
            where: { requestLineId },
        });
        if (!reservation)
            return;
        await tx.stockSnapshot.update({
            where: { itemId_locationId: { itemId: reservation.itemId, locationId: reservation.locationId } },
            data: {
                reservedQuantity: { decrement: reservation.quantity },
            },
        });
        await tx.reservation.delete({
            where: { id: reservation.id },
        });
    }
    async commit(tx, requestLineId) {
        await this.release(tx, requestLineId);
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map