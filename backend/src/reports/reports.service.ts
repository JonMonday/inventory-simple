import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async getStockOnHand(query: { locationId?: string, skip?: number, take?: number, sortBy?: string, order?: 'asc' | 'desc' }) {
        const { locationId, skip = 0, take = 50, sortBy = 'lastUpdatedAt', order = 'desc' } = query;
        return this.prisma.stockSnapshot.findMany({
            where: locationId ? { locationId } : {},
            include: { item: true, location: true },
            orderBy: { [sortBy]: order },
            skip: Number(skip),
            take: Number(take),
        });
    }

    async getMovements(filters: { fromDate?: string, toDate?: string, itemId?: string, locationId?: string, skip?: number, take?: number, sortBy?: string, order?: 'asc' | 'desc' }) {
        const { skip = 0, take = 50, sortBy = 'createdAtUtc', order = 'desc' } = filters;
        const where: any = {};
        if (filters.fromDate) where.createdAtUtc = { gte: new Date(filters.fromDate) };
        if (filters.toDate) where.createdAtUtc = { ...where.createdAtUtc, lte: new Date(filters.toDate) };
        if (filters.itemId) where.itemId = filters.itemId;
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
        // Find items where onHand < reorderLevel
        // Complex query for Prisma unless we use raw query or filter in JS.
        // We have `StockSnapshot` but reorderLevel is on `Item`.
        // We can fetch snapshots with item include and filter in JS.
        // Or Raw SQL.
        // Let's use JS filter for simplicity unless volume is huge.

        const snapshots = await this.prisma.stockSnapshot.findMany({
            include: { item: true, location: true },
            where: { quantityOnHand: { gt: 0 } } // Optimization?
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

    async getAdjustmentsSummary(query: { fromDate?: string, toDate?: string }) {
        const where: any = { movementType: { in: ['ADJUSTMENT', 'REVERSAL'] } };
        if (query.fromDate) where.createdAtUtc = { gte: new Date(query.fromDate) };
        if (query.toDate) where.createdAtUtc = { ...where.createdAtUtc, lte: new Date(query.toDate) };

        const adjustments = await this.prisma.inventoryLedger.findMany({
            where,
            include: { reasonCode: true, item: true },
        });

        // Group by reason code
        const summary = adjustments.reduce((acc: any, curr) => {
            const key = curr.reasonCode.name;
            if (!acc[key]) acc[key] = { count: 0, totalAbsQty: 0, reason: key };
            acc[key].count++;
            acc[key].totalAbsQty += Math.abs(curr.quantity);
            return acc;
        }, {});

        return Object.values(summary);
    }
}
