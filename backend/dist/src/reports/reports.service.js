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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStockOnHand(query) {
        const { locationId, skip = 0, take = 50, sortBy = 'lastUpdatedAt', order = 'desc' } = query;
        return this.prisma.stockSnapshot.findMany({
            where: locationId ? { locationId } : {},
            include: { item: true, location: true },
            orderBy: { [sortBy]: order },
            skip: Number(skip),
            take: Number(take),
        });
    }
    async getMovements(filters) {
        const { skip = 0, take = 50, sortBy = 'createdAtUtc', order = 'desc' } = filters;
        const where = {};
        if (filters.fromDate)
            where.createdAtUtc = { gte: new Date(filters.fromDate) };
        if (filters.toDate)
            where.createdAtUtc = { ...where.createdAtUtc, lte: new Date(filters.toDate) };
        if (filters.itemId)
            where.itemId = filters.itemId;
        if (filters.locationId) {
            where.OR = [
                { fromLocationId: filters.locationId },
                { toLocationId: filters.locationId }
            ];
        }
        return this.prisma.inventoryLedger.findMany({
            where,
            include: { item: true, reasonCode: true, createdBy: true },
            orderBy: { [sortBy]: order },
            skip: Number(skip),
            take: Number(take),
        });
    }
    async getLowStock() {
        const snapshots = await this.prisma.stockSnapshot.findMany({
            include: { item: true, location: true },
            where: { quantityOnHand: { gt: 0 } }
        });
        return snapshots.filter(s => {
            const level = s.item.reorderLevel || 0;
            return s.quantityOnHand <= level;
        });
    }
    async getRequestKPIs() {
        const total = await this.prisma.request.count();
        const fulfilled = await this.prisma.request.count({ where: { status: 'FULFILLED' } });
        const rejected = await this.prisma.request.count({ where: { status: 'REJECTED' } });
        return {
            totalRequests: total,
            fulfillmentRate: total ? (fulfilled / total) * 100 : 0,
            rejectedCount: rejected
        };
    }
    async getAdjustmentsSummary(query) {
        const where = { movementType: { in: ['ADJUSTMENT', 'REVERSAL'] } };
        if (query.fromDate)
            where.createdAtUtc = { gte: new Date(query.fromDate) };
        if (query.toDate)
            where.createdAtUtc = { ...where.createdAtUtc, lte: new Date(query.toDate) };
        const adjustments = await this.prisma.inventoryLedger.findMany({
            where,
            include: { reasonCode: true, item: true },
        });
        const summary = adjustments.reduce((acc, curr) => {
            const key = curr.reasonCode.name;
            if (!acc[key])
                acc[key] = { count: 0, totalAbsQty: 0, reason: key };
            acc[key].count++;
            acc[key].totalAbsQty += Math.abs(curr.quantity);
            return acc;
        }, {});
        return Object.values(summary);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map