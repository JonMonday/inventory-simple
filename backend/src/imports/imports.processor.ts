import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Processor('import-queue')
export class ImportsProcessor extends WorkerHost {
    constructor(private prisma: PrismaService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { jobId, fileBase64 } = job.data;
        const buffer = Buffer.from(fileBase64, 'base64') as any;

        await this.prisma.importJob.update({
            where: { id: jobId },
            data: { status: 'PROCESSING' },
        });

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            // 1. Process "Inventory- Stock Control" Sheet
            const stockSheet = workbook.getWorksheet('Inventory- Stock Control');
            if (stockSheet) {
                await this.processStockSheet(stockSheet, jobId);
            }

            // 2. Process "Data" Sheet (Categories, Depts, UOMs etc)
            const dataSheet = workbook.getWorksheet('Data');
            if (dataSheet) {
                await this.processDataSheet(dataSheet);
            }

            await this.prisma.importJob.update({
                where: { id: jobId },
                data: { status: 'COMPLETED', processedAt: new Date() },
            });
        } catch (error) {
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

    private async processStockSheet(sheet: ExcelJS.Worksheet, jobId: string) {
        // Basic logic to iterate rows and upsert items + initial ledger
        // Header check and column mapping happens here
        sheet.eachRow({ includeEmpty: false }, async (row: ExcelJS.Row, rowNumber: number) => {
            if (rowNumber === 1) return; // Skip header

            const sku = row.getCell(1).text; // ITEM NO.
            const name = row.getCell(2).text; // ITEM NAME
            const desc = row.getCell(3).text; // INVENTORY DESCRIPTION
            const uomName = row.getCell(4).text; // UNIT OF MEASURE
            const openingBalance = parseFloat(row.getCell(5).text || '0');
            const reorderLevel = parseFloat(row.getCell(7).text || '0');
            const reorderQty = parseFloat(row.getCell(8).text || '0');
            const discontinued = row.getCell(9).text.toUpperCase() === 'YES';

            if (!sku || !name) return;

            await this.prisma.$transaction(async (tx: any) => {
                // Find or create UOM
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

                // If opening balance > 0 and it's a new item or no ledger exists
                const existingLedger = await tx.inventoryLedger.findFirst({
                    where: { itemId: item.id }
                });

                if (!existingLedger && openingBalance > 0) {
                    // Create initial receipt
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
                            createdById: (await tx.user.findFirst()).id, // In reality, use system user or current user
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

    private async processDataSheet(sheet: ExcelJS.Worksheet) {
        // Implementation for categories, departments etc.
    }
}
