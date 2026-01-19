import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('stock-on-hand')
    @Permissions('reports.view')
    async getStockOnHand(@Query('locationId') locationId?: string) {
        return this.reportsService.getStockOnHand(locationId);
    }

    @Get('movements')
    @Permissions('reports.view')
    async getMovements(@Query() query: any) {
        return this.reportsService.getMovements(query);
    }

    @Get('low-stock')
    @Permissions('reports.view')
    async getLowStock() {
        return this.reportsService.getLowStock();
    }

    @Get('request-kpis')
    @Permissions('reports.view')
    async getRequestKPIs() {
        return this.reportsService.getRequestKPIs();
    }
}
