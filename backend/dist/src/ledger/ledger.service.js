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
exports.LedgerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LedgerService = class LedgerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEntry(data) {
        const { itemId, fromLocationId, toLocationId, movementType, quantity, userId, reasonCodeId, ...rest } = data;
        return this.prisma.$transaction(async (tx) => {
            const ledgerEntry = await tx.inventoryLedger.create({
                data: {
                    item: { connect: { id: itemId } },
                    fromLocation: fromLocationId ? { connect: { id: fromLocationId } } : undefined,
                    toLocation: toLocationId ? { connect: { id: toLocationId } } : undefined,
                    movementType,
                    quantity,
                    reasonCode: { connect: { id: reasonCodeId } },
                    createdBy: { connect: { id: userId } },
                    ...rest,
                },
            });
            if (fromLocationId) {
                await this.updateSnapshot(tx, itemId, fromLocationId, -quantity);
            }
            if (toLocationId) {
                await this.updateSnapshot(tx, itemId, toLocationId, quantity);
            }
            return ledgerEntry;
        });
    }
    async updateSnapshot(tx, itemId, locationId, quantity) {
        const snapshot = await tx.stockSnapshot.upsert({
            where: {
                itemId_locationId: {
                    itemId,
                    locationId,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                itemId,
                locationId,
                quantity,
            },
        });
        if (snapshot.quantity < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative at this location');
        }
        return snapshot;
    }
    async getLedger(filters) {
        return this.prisma.inventoryLedger.findMany({
            where: filters,
            include: {
                item: true,
                fromLocation: true,
                toLocation: true,
                reasonCode: true,
                createdBy: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.LedgerService = LedgerService;
exports.LedgerService = LedgerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LedgerService);
//# sourceMappingURL=ledger.service.js.map