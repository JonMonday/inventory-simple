import { Controller, Get, Query, UseGuards, StreamableFile, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('stock-on-hand')
    @Permissions('reports.view')
    async getStockOnHand(@Query() query: any, @Res({ passthrough: true }) res: any) {
        const data = await this.reportsService.getStockOnHand(query);
        if (query.export === 'csv') {
            return this.exportCsv(res, 'stock-on-hand.csv', data.map(s => ({
                itemCode: s.item.code,
                itemName: s.item.name,
                location: s.storeLocation.name,
                onHand: s.quantityOnHand,
                reserved: s.reservedQuantity,
                available: s.quantityOnHand - s.reservedQuantity,
                lastUpdated: s.lastUpdatedAt.toISOString()
            })), {
                itemCode: 'Item Code',
                itemName: 'Item Name',
                location: 'Location',
                onHand: 'On Hand',
                reserved: 'Reserved',
                available: 'Available',
                lastUpdated: 'Last Updated'
            });
        }
        return data;
    }

    @Get('movements')
    @Permissions('reports.view')
    async getMovements(@Query() query: any, @Res({ passthrough: true }) res: any) {
        const data = await this.reportsService.getMovements(query);
        if (query.export === 'csv') {
            return this.exportCsv(res, 'movements.csv', data.map(m => ({
                date: m.createdAtUtc.toISOString(),
                itemCode: m.item.code,
                itemName: m.item.name,
                type: m.movementType.label,
                qty: m.quantity,
                reason: m.reasonCode.name,
                user: m.createdBy.fullName,
                ref: m.referenceNo || ''
            })), {
                date: 'Date (UTC)',
                itemCode: 'Item Code',
                itemName: 'Item Name',
                type: 'Type',
                qty: 'Quantity',
                reason: 'Reason',
                user: 'User',
                ref: 'Reference'
            });
        }
        return data;
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

    @Get('adjustments-summary')
    @Permissions('reports.view')
    async getAdjustmentsSummary(@Query() query: any) {
        return this.reportsService.getAdjustmentsSummary(query);
    }

    private async exportCsv(res: Response, filename: string, data: any[], headers: Record<string, string>) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        worksheet.columns = Object.keys(headers).map(key => ({ header: headers[key], key }));
        worksheet.addRows(data);

        const buffer = await workbook.csv.writeBuffer();
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });
        return new StreamableFile(Buffer.from(buffer));
    }
}
