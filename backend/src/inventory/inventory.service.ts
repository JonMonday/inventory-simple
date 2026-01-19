import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RestockDto } from './dto/restock.dto';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generic method to record any inventory movement.
     * Validates reason codes, creates ledger entry, and updates stock snapshot.
     */
    async recordMovement(tx: any, data: {
        itemId: string,
        locationId: string,
        movementType: 'RECEIVE' | 'ISSUE' | 'ADJUSTMENT' | 'TRANSFER' | 'REVERSAL',
        quantity: number,
        reasonCodeId: string,
        reasonText?: string,
        referenceNo?: string,
        unitCost?: number,
        userId: string,
        comments?: string,
        relatedLocationId?: string,
        reversalOfLedgerId?: string,
    }) {
        if (data.movementType !== 'REVERSAL' && data.movementType !== 'ADJUSTMENT' && data.quantity <= 0) throw new BadRequestException('Quantity must be positive');

        const item = await tx.item.findUnique({ where: { id: data.itemId } });
        if (!item) throw new BadRequestException(`Item ${data.itemId} not found`);

        const reasonCode = await tx.reasonCode.findUnique({ where: { id: data.reasonCodeId } });
        if (!reasonCode) throw new BadRequestException(`Reason Code ${data.reasonCodeId} not found`);

        await this.validateReasonPolicy(tx, reasonCode, Math.abs(data.quantity), data.unitCost || 0, data.userId, data.reasonText);

        const ledgerData: any = {
            itemId: data.itemId,
            movementType: data.movementType,
            quantity: Math.abs(data.quantity),
            unitOfMeasure: item.unitOfMeasure,
            reasonCodeId: data.reasonCodeId,
            reasonText: data.reasonText,
            referenceNo: data.referenceNo,
            comments: data.comments,
            createdByUserId: data.userId,
            unitCost: data.unitCost,
            totalCost: data.unitCost ? data.unitCost * Math.abs(data.quantity) : undefined,
            source: 'API',
            reversalOfLedgerId: data.reversalOfLedgerId
        };

        let increment = 0;
        if (data.movementType === 'RECEIVE') {
            ledgerData.toLocationId = data.locationId;
            ledgerData.fromLocationId = data.relatedLocationId;
            increment = data.quantity;
        } else if (data.movementType === 'ISSUE') {
            ledgerData.fromLocationId = data.locationId;
            ledgerData.toLocationId = data.relatedLocationId;
            increment = -data.quantity;
        } else if (data.movementType === 'ADJUSTMENT' || data.movementType === 'REVERSAL') {
            increment = data.quantity;
            if (increment > 0) {
                ledgerData.toLocationId = data.locationId;
            } else {
                ledgerData.fromLocationId = data.locationId;
            }
        }

        const ledger = await tx.inventoryLedger.create({ data: ledgerData });

        await tx.stockSnapshot.upsert({
            where: { itemId_locationId: { itemId: data.itemId, locationId: data.locationId } },
            update: { quantityOnHand: { increment: increment } },
            create: {
                itemId: data.itemId,
                locationId: data.locationId,
                quantityOnHand: increment > 0 ? increment : 0,
            },
        });

        return ledger;
    }

    async reverseLedgerEntry(tx: any, ledgerId: string, userId: string, reasonCodeId: string, notes?: string) {
        const original = await tx.inventoryLedger.findUnique({ where: { id: ledgerId } });
        if (!original) throw new NotFoundException('Original ledger entry not found');
        if (original.reversalOfLedgerId) throw new BadRequestException('Cannot reverse a reversal');

        const existingReversal = await tx.inventoryLedger.findFirst({ where: { reversalOfLedgerId: ledgerId } });
        if (existingReversal) throw new BadRequestException('Ledger entry already reversed');

        let quantity = 0;
        let locationId = '';

        if (original.movementType === 'RECEIVE') {
            locationId = original.toLocationId;
            quantity = -original.quantity;
        } else if (original.movementType === 'ISSUE') {
            locationId = original.fromLocationId;
            quantity = original.quantity;
        } else if (original.movementType === 'ADJUSTMENT') {
            if (original.toLocationId) {
                locationId = original.toLocationId;
                quantity = -original.quantity;
            } else {
                locationId = original.fromLocationId;
                quantity = original.quantity;
            }
        } else {
            throw new BadRequestException(`Reversal not implemented for movement type ${original.movementType}`);
        }

        await this.recordMovement(tx, {
            itemId: original.itemId,
            locationId: locationId,
            movementType: 'REVERSAL',
            quantity: quantity,
            reasonCodeId,
            userId,
            comments: `Reversal of ${original.referenceNo || ledgerId}. ${notes || ''}`,
            reversalOfLedgerId: ledgerId
        });
    }

    private async validateReasonPolicy(tx: any, code: any, quantity: number, unitCost: number, userId: string, text?: string) {
        if (code.requiresFreeText && !text) {
            throw new BadRequestException(`Reason code ${code.name} requires a description/text.`);
        }
    }

    async receive(userId: string, dto: RestockDto) {
        return this.prisma.$transaction(async (tx) => {
            const location = await tx.location.findUnique({ where: { id: dto.locationId } });
            if (!location || location.type === 'DEPARTMENT') {
                throw new BadRequestException('Cannot receive inventory into a DEPARTMENT location');
            }

            const results = [];
            for (const line of dto.lines) {
                const reasonCode = await tx.reasonCode.findFirst({
                    where: { movementType: 'RECEIVE', isActive: true },
                });
                if (!reasonCode) throw new BadRequestException('No active RECEIVE reason code found');

                const ledger = await this.recordMovement(tx, {
                    itemId: line.itemId,
                    locationId: dto.locationId,
                    movementType: 'RECEIVE',
                    quantity: line.quantity,
                    reasonCodeId: reasonCode.id,
                    userId,
                    comments: dto.comments,
                    referenceNo: dto.referenceNo,
                    unitCost: line.unitCost,
                });
                results.push(ledger);
            }
            return results;
        });
    }
}
