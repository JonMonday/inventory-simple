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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = __importStar(require("exceljs"));
let ImportsProcessor = class ImportsProcessor extends bullmq_1.WorkerHost {
    prisma;
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { jobId, fileBase64 } = job.data;
        const buffer = Buffer.from(fileBase64, 'base64');
        await this.prisma.importJob.update({
            where: { id: jobId },
            data: { status: 'PROCESSING' },
        });
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const stockSheet = workbook.getWorksheet('Inventory- Stock Control');
            if (stockSheet) {
                await this.processStockSheet(stockSheet, jobId);
            }
            const dataSheet = workbook.getWorksheet('Data');
            if (dataSheet) {
                await this.processDataSheet(dataSheet);
            }
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: { status: 'COMPLETED', processedAt: new Date() },
            });
        }
        catch (error) {
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                    errorLog: { message: error.message, stack: error.stack }
                },
            });
            throw error;
        }
    }
    async processStockSheet(sheet, jobId) {
        sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
            if (rowNumber === 1)
                return;
            const sku = row.getCell(1).text;
            const name = row.getCell(2).text;
            const desc = row.getCell(3).text;
            const uomName = row.getCell(4).text;
            const openingBalance = parseFloat(row.getCell(5).text || '0');
            const reorderLevel = parseFloat(row.getCell(7).text || '0');
            const reorderQty = parseFloat(row.getCell(8).text || '0');
            const discontinued = row.getCell(9).text.toUpperCase() === 'YES';
            if (!sku || !name)
                return;
            await this.prisma.$transaction(async (tx) => {
                const uom = await tx.unitOfMeasure.upsert({
                    where: { name: uomName || 'UNIT' },
                    create: { name: uomName || 'UNIT' },
                    update: {},
                });
                const item = await tx.item.upsert({
                    where: { sku },
                    update: {
                        name,
                        description: desc,
                        uomId: uom.id,
                        reorderLevel,
                        reorderQuantity: reorderQty,
                        discontinued,
                    },
                    create: {
                        sku,
                        name,
                        description: desc,
                        uomId: uom.id,
                        reorderLevel,
                        reorderQuantity: reorderQty,
                        discontinued,
                    },
                });
                const existingLedger = await tx.inventoryLedger.findFirst({
                    where: { itemId: item.id }
                });
                if (!existingLedger && openingBalance > 0) {
                    const reason = await tx.reasonCode.upsert({
                        where: { code: 'INITIAL_STOCK' },
                        create: { code: 'INITIAL_STOCK', description: 'Opening Balance Seeding' },
                        update: {},
                    });
                    const defaultLocation = await tx.location.upsert({
                        where: { name: 'Main Store' },
                        create: { name: 'Main Store', type: 'STORE' },
                        update: {},
                    });
                    await tx.inventoryLedger.create({
                        data: {
                            itemId: item.id,
                            toLocationId: defaultLocation.id,
                            movementType: 'RECEIVE',
                            quantity: openingBalance,
                            reasonCodeId: reason.id,
                            createdById: (await tx.user.findFirst()).id,
                            source: 'IMPORT',
                            importJobId: jobId,
                        }
                    });
                    await tx.stockSnapshot.upsert({
                        where: { itemId_locationId: { itemId: item.id, locationId: defaultLocation.id } },
                        update: { quantity: { increment: openingBalance } },
                        create: { itemId: item.id, locationId: defaultLocation.id, quantity: openingBalance },
                    });
                }
            });
        });
    }
    async processDataSheet(sheet) {
    }
};
exports.ImportsProcessor = ImportsProcessor;
exports.ImportsProcessor = ImportsProcessor = __decorate([
    (0, bullmq_1.Processor)('import-queue'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportsProcessor);
//# sourceMappingURL=imports.processor.js.map