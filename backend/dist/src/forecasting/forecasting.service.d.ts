import { PrismaService } from '../prisma/prisma.service';
export declare class ForecastingService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    calculateForecast(itemId: string, period: string): Promise<{
        id: string;
        createdAt: Date;
        itemId: string;
        period: string;
        forecastQty: number;
        recommendedOrder: number;
        method: string;
    } | {
        forecastQty: number;
        recommendedOrder: number;
    }>;
    runNightlyJobs(): Promise<void>;
}
