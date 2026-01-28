import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RestockDto } from './dto/restock.dto';
import { ReturnDto } from './dto/return.dto';
import { TransferDto } from './dto/transfer.dto';
import { AdjustDto } from './dto/adjust.dto';

import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    /**
     * Internal helper for atomic stock movements. 
     * Must be called within a transaction.
     */
    async recordMovement(tx: any, data: {
        itemId: string;
        locationId: string;
        movementType: string;
        quantity: number;
        reasonCodeId: string;
        userId: string;
        referenceNo?: string;
        comments?: string;
    }) {
        const item = await tx.item.findUnique({ where: { id: data.itemId } });
        if (!item) throw new NotFoundException(`Item not found: ${data.itemId}`);

        const mType = await tx.ledgerMovementType.findUnique({ where: { code: data.movementType } });
        if (!mType) throw new BadRequestException(`Invalid movement type: ${data.movementType}`);

        // 1. Update Snapshot
        await tx.stockSnapshot.upsert({
            where: { itemId_storeLocationId: { itemId: data.itemId, storeLocationId: data.locationId } },
            update: { quantityOnHand: { increment: data.quantity } },
            create: { itemId: data.itemId, storeLocationId: data.locationId, quantityOnHand: data.quantity }
        });

        // 2. Ledger Entry
        return tx.inventoryLedger.create({
            data: {
                itemId: data.itemId,
                [data.quantity > 0 ? 'toStoreLocationId' : 'fromStoreLocationId']: data.locationId,
                movementTypeId: mType.id,
                quantity: Math.abs(data.quantity),
                unitOfMeasure: item.unitOfMeasure,
                reasonCodeId: data.reasonCodeId,
                reasonText: data.comments,
                createdByUserId: data.userId,
                referenceNo: data.referenceNo,
            }
        });
    }

    // ========================================================================
    // CORE MOVEMENTS
    // ========================================================================

    async receive(userId: string, dto: RestockDto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'RECEIVE' } });

            const results = [];
            for (const line of dto.lines) {
                const item = await tx.item.findUnique({ where: { id: line.itemId } });
                if (!item) throw new NotFoundException(`Item not found: ${line.itemId}`);

                // 1. Update/Create Snapshot
                await tx.stockSnapshot.upsert({
                    where: { itemId_storeLocationId: { itemId: line.itemId, storeLocationId: dto.locationId } },
                    update: { quantityOnHand: { increment: line.quantity } },
                    create: { itemId: line.itemId, storeLocationId: dto.locationId, quantityOnHand: line.quantity }
                });

                // 2. Create Ledger Entry
                const entry = await tx.inventoryLedger.create({
                    data: {
                        itemId: line.itemId,
                        toStoreLocationId: dto.locationId,
                        movementTypeId: movementType!.id,
                        quantity: line.quantity,
                        unitOfMeasure: item.unitOfMeasure,
                        reasonCodeId: null as any, // Needs a default or specific one for restock
                        reasonText: dto.comments,
                        createdByUserId: userId,
                        referenceNo: dto.referenceNo,
                        unitCost: line.unitCost,
                        totalCost: line.unitCost * line.quantity
                    }
                });
                results.push(entry);
            }
            return results;
        });
    }

    async returnStock(userId: string, dto: ReturnDto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'RECEIVE' } });
            const item = await tx.item.findUnique({ where: { id: dto.itemId } });
            if (!item) throw new NotFoundException('Item not found');

            // 1. Update Snapshot
            await tx.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.toLocationId } },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: { itemId: dto.itemId, storeLocationId: dto.toLocationId, quantityOnHand: dto.quantity }
            });

            // 2. Ledger Entry
            return tx.inventoryLedger.create({
                data: {
                    itemId: dto.itemId,
                    fromStoreLocationId: dto.fromLocationId,
                    toStoreLocationId: dto.toLocationId,
                    movementTypeId: movementType!.id,
                    quantity: dto.quantity,
                    unitOfMeasure: item.unitOfMeasure,
                    reasonCodeId: dto.reasonCodeId,
                    reasonText: dto.comments,
                    createdByUserId: userId,
                }
            });
        });
    }

    async transfer(userId: string, dto: TransferDto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'TRANSFER' } });
            const item = await tx.item.findUnique({ where: { id: dto.itemId } });
            if (!item) throw new NotFoundException('Item not found');

            // 1. Check Source QTY
            const source = await tx.stockSnapshot.findUnique({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.fromStoreLocationId } }
            });
            if (!source || source.quantityOnHand < dto.quantity) {
                throw new BadRequestException('Insufficient stock for transfer');
            }

            // 2. Update Source
            await tx.stockSnapshot.update({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.fromStoreLocationId } },
                data: { quantityOnHand: { decrement: dto.quantity } }
            });

            // 3. Update Destination
            await tx.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.toStoreLocationId } },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: { itemId: dto.itemId, storeLocationId: dto.toStoreLocationId, quantityOnHand: dto.quantity }
            });

            // 4. Ledger Entry
            return tx.inventoryLedger.create({
                data: {
                    itemId: dto.itemId,
                    fromStoreLocationId: dto.fromStoreLocationId,
                    toStoreLocationId: dto.toStoreLocationId,
                    movementTypeId: movementType!.id,
                    quantity: dto.quantity,
                    unitOfMeasure: item.unitOfMeasure,
                    reasonCodeId: dto.reasonCodeId,
                    reasonText: dto.reasonText,
                    createdByUserId: userId,
                }
            });
        });
    }

    async adjust(userId: string, dto: AdjustDto) {
        return this.prisma.$transaction(async (tx) => {
            const movementType = await tx.ledgerMovementType.findUnique({ where: { code: 'ADJUSTMENT' } });
            const item = await tx.item.findUnique({ where: { id: dto.itemId } });
            if (!item) throw new NotFoundException('Item not found');

            // 1. Update/Create Snapshot
            await tx.stockSnapshot.upsert({
                where: { itemId_storeLocationId: { itemId: dto.itemId, storeLocationId: dto.storeLocationId } },
                update: { quantityOnHand: { increment: dto.quantity } },
                create: { itemId: dto.itemId, storeLocationId: dto.storeLocationId, quantityOnHand: dto.quantity }
            });

            // 2. Ledger Entry
            return tx.inventoryLedger.create({
                data: {
                    itemId: dto.itemId,
                    toStoreLocationId: dto.storeLocationId,
                    movementTypeId: movementType!.id,
                    quantity: dto.quantity,
                    unitOfMeasure: item.unitOfMeasure,
                    reasonCodeId: dto.reasonCodeId,
                    reasonText: dto.reasonText,
                    createdByUserId: userId,
                }
            });
        });
    }

    async findAllLedger() {
        return this.prisma.inventoryLedger.findMany({
            include: { item: true, movementType: true, fromStoreLocation: true, toStoreLocation: true, reasonCode: true, createdBy: true },
            orderBy: { createdAtUtc: 'desc' }
        });
    }

    async reverseLedgerEntry(tx: any, id: string, userId: string, reasonCodeId: string, notes?: string) {
        const original = await tx.inventoryLedger.findUnique({
            where: { id },
            include: { movementType: true }
        });
        if (!original) throw new NotFoundException('Original ledger entry not found');

        const existingReversal = await tx.inventoryLedger.findFirst({ where: { reversalOfLedgerId: id } });
        if (existingReversal) throw new BadRequestException('Ledger entry already reversed');

        const reversalType = await tx.ledgerMovementType.findUnique({ where: { code: 'REVERSAL' } });

        if (original.toStoreLocationId) {
            await tx.stockSnapshot.update({
                where: { itemId_storeLocationId: { itemId: original.itemId, storeLocationId: original.toStoreLocationId } },
                data: { quantityOnHand: { decrement: original.quantity } }
            });
        }
        if (original.fromStoreLocationId) {
            await tx.stockSnapshot.update({
                where: { itemId_storeLocationId: { itemId: original.itemId, storeLocationId: original.fromStoreLocationId } },
                data: { quantityOnHand: { increment: original.quantity } }
            });
        }

        return tx.inventoryLedger.create({
            data: {
                itemId: original.itemId,
                fromStoreLocationId: original.toStoreLocationId,
                toStoreLocationId: original.fromStoreLocationId,
                movementTypeId: reversalType!.id,
                quantity: original.quantity,
                unitOfMeasure: original.unitOfMeasure,
                reasonCodeId,
                reasonText: notes || `Reversal of entry ${original.id}`,
                createdByUserId: userId,
                referenceNo: original.referenceNo,
                reversalOfLedgerId: id
            }
        });
    }

    // ========================================================================
    // VIEWS & DIAGNOSTICS
    // ========================================================================

    async findAllLocations() {
        return this.prisma.storeLocation.findMany({ include: { branch: true } });
    }

    async findAllReasonCodes() {
        return this.prisma.reasonCode.findMany();
    }

    async getLedger(filters?: { itemId?: string; storeId?: string; type?: string; from?: string; to?: string }) {
        return this.prisma.inventoryLedger.findMany({
            where: {
                itemId: filters?.itemId,
                OR: [
                    { fromStoreLocationId: filters?.storeId },
                    { toStoreLocationId: filters?.storeId }
                ]
            },
            include: { item: true, movementType: true, fromStoreLocation: true, toStoreLocation: true, reasonCode: true, createdBy: true },
            orderBy: { createdAtUtc: 'desc' }
        });
    }

    async getStockSnapshots(filters?: { itemId?: string; storeId?: string }) {
        return this.prisma.stockSnapshot.findMany({
            where: {
                itemId: filters?.itemId,
                storeLocationId: filters?.storeId
            },
            include: { item: true, storeLocation: true }
        });
    }

    async getSnapshot(itemId: string, locId: string) {
        const snapshot = await this.prisma.stockSnapshot.findUnique({
            where: { itemId_storeLocationId: { itemId, storeLocationId: locId } },
            include: { item: true, storeLocation: true }
        });
        if (!snapshot) throw new NotFoundException('Stock snapshot not found');
        return snapshot;
    }

    async getGlobalReservations() {
        return this.prisma.reservation.findMany({
            include: {
                request: { select: { readableId: true } },
                requestLine: { include: { item: true } },
                stockSnapshot: { include: { storeLocation: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
