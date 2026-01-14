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
var ForecastingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ForecastingService = ForecastingService_1 = class ForecastingService {
    prisma;
    logger = new common_1.Logger(ForecastingService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateForecast(itemId, period) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const issues = await this.prisma.inventoryLedger.findMany({
            where: {
                itemId,
                movementType: 'ISSUE',
                createdAt: { gte: threeMonthsAgo },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (issues.length === 0)
            return { forecastQty: 0, recommendedOrder: 0 };
        const totalQty = issues.reduce((sum, issue) => sum + issue.quantity, 0);
        const averageMonthlyConsumption = totalQty / 3;
        const snapshot = await this.prisma.stockSnapshot.aggregate({
            where: { itemId },
            _sum: { quantity: true },
        });
        const currentStock = snapshot._sum.quantity || 0;
        const safetyBuffer = averageMonthlyConsumption * 0.2;
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
        const period = new Date().toISOString().slice(0, 7);
        for (const item of items) {
            await this.calculateForecast(item.id, period);
        }
        this.logger.log('Nightly forecasting job completed.');
    }
};
exports.ForecastingService = ForecastingService;
exports.ForecastingService = ForecastingService = ForecastingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ForecastingService);
//# sourceMappingURL=forecasting.service.js.map