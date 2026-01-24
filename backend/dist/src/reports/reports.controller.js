"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const reports_service_1 = require("./reports.service");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const ExcelJS = __importStar(require("exceljs"));
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getStockOnHand(query, res) {
        const data = await this.reportsService.getStockOnHand(query);
        if (query.export === 'csv') {
            return this.exportCsv(res, 'stock-on-hand.csv', data.map(s => ({
                itemCode: s.item.code,
                itemName: s.item.name,
                location: s.location.name,
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
    async getMovements(query, res) {
        const data = await this.reportsService.getMovements(query);
        if (query.export === 'csv') {
            return this.exportCsv(res, 'movements.csv', data.map(m => ({
                date: m.createdAtUtc.toISOString(),
                itemCode: m.item.code,
                itemName: m.item.name,
                type: m.movementType,
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
    async getLowStock() {
        return this.reportsService.getLowStock();
    }
    async getRequestKPIs() {
        return this.reportsService.getRequestKPIs();
    }
    async getAdjustmentsSummary(query) {
        return this.reportsService.getAdjustmentsSummary(query);
    }
    async exportCsv(res, filename, data, headers) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        worksheet.columns = Object.keys(headers).map(key => ({ header: headers[key], key }));
        worksheet.addRows(data);
        const buffer = await workbook.csv.writeBuffer();
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });
        return new common_1.StreamableFile(Buffer.from(buffer));
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('stock-on-hand'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockOnHand", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('request-kpis'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRequestKPIs", null);
__decorate([
    (0, common_1.Get)('adjustments-summary'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAdjustmentsSummary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map