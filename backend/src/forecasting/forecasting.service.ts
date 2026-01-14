import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForecastingService {
    private readonly logger = new Logger(ForecastingService.name);

    constructor(private prisma: PrismaService) { }

    async calculateForecast(itemId: string, period: string) {
        // 1. Get historical issues (consumption) for the last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const issues = await (this.prisma as any).inventoryLedger.findMany({
            where: {
                itemId,
                movementType: 'ISSUE',
                createdAt: { gte: threeMonthsAgo },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (issues.length === 0) return { forecastQty: 0, recommendedOrder: 0 };

        // 2. Simple Moving Average (SMA)
        const totalQty = issues.reduce((sum: number, issue: any) => sum + issue.quantity, 0);
        const averageMonthlyConsumption = totalQty / 3;

        // 3. Recommended order = (Forecast + Safety Buffer) - Current Stock
        const snapshot = await this.prisma.stockSnapshot.aggregate({
            where: { itemId },
            _sum: { quantity: true },
        });
        const currentStock = snapshot._sum.quantity || 0;
        const safetyBuffer = averageMonthlyConsumption * 0.2; // 20% safety buffer

        const recommendedOrder = Math.max(0, averageMonthlyConsumption + safetyBuffer - currentStock);

        return this.prisma.forecastResult.upsert({
            where: {
                itemId_period: {
                    itemId,
                    period,
                },
            },
            update: {
                forecastQty: averageMonthlyConsumption,
                recommendedOrder,
                method: 'MOVING_AVERAGE',
            },
            create: {
                itemId,
                period,
                forecastQty: averageMonthlyConsumption,
                recommendedOrder,
                method: 'MOVING_AVERAGE',
            },
        });
    }

    async runNightlyJobs() {
        this.logger.log('Starting nightly forecasting job...');
        const items = await this.prisma.item.findMany({ where: { discontinued: false } });
        const period = new Date().toISOString().slice(0, 7); // YYYY-MM

        for (const item of items) {
            await this.calculateForecast(item.id, period);
        }
        this.logger.log('Nightly forecasting job completed.');
    }
}
