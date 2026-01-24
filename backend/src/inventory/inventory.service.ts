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
        movementType: 'RECEIVE' | 'ISSUE' | 'ADJUSTMENT' | 'TRANSFER' | 'REVERSAL' | 'RETURN',
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
        const validMovements = ['RECEIVE', 'ISSUE', 'ADJUSTMENT', 'TRANSFER', 'REVERSAL', 'RETURN'];
        if (!validMovements.includes(data.movementType)) throw new BadRequestException(`Invalid movement type: ${data.movementType}`);

        if (data.movementType !== 'REVERSAL' && data.movementType !== 'ADJUSTMENT' && data.quantity <= 0) throw new BadRequestException('Quantity must be positive');

        const item = await tx.item.findUnique({ where: { id: data.itemId } });
        if (!item) throw new BadRequestException(`Item ${data.itemId} not found`);

        const reasonCode = await tx.reasonCode.findUnique({
            where: { id: data.reasonCodeId },
            include: { allowedMovements: true }
        });

        if (!reasonCode) throw new BadRequestException(`Reason Code ${data.reasonCodeId} not found`);
        if (!reasonCode.isActive) throw new BadRequestException(`Reason Code ${data.reasonCodeId} is not active`);

        const isAllowed = reasonCode.allowedMovements.some((m: any) => m.movementType === data.movementType);
        if (!isAllowed) {
            throw new BadRequestException(`Reason Code ${reasonCode.code} is not permitted for movement type ${data.movementType}`);
        }

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
        } else if (data.movementType === 'RETURN') {
            ledgerData.toLocationId = data.locationId;
            ledgerData.fromLocationId = data.relatedLocationId;
            increment = data.quantity;
        } else if (data.movementType === 'TRANSFER') {
            if (!data.relatedLocationId) throw new BadRequestException('Transfer requires relatedLocationId (source)');
            ledgerData.toLocationId = data.locationId;
            ledgerData.fromLocationId = data.relatedLocationId;
            increment = data.quantity;

            // Decrement from source location
            await tx.stockSnapshot.update({
                where: { itemId_locationId: { itemId: data.itemId, locationId: data.relatedLocationId } },
                data: { quantityOnHand: { decrement: data.quantity } },
            });
        }

        const ledger = await tx.inventoryLedger.create({ data: ledgerData });

        // Enforce Reserved Stock for ISSUES and TRANSFERS
        // We must ensure the location has enough AVAILABLE stock (onHand - reservedQuantity)
        if (data.movementType === 'ISSUE' || data.movementType === 'TRANSFER' || (data.movementType === 'ADJUSTMENT' && increment < 0)) {
            const locId = (data.movementType === 'TRANSFER') ? data.relatedLocationId : data.locationId;
            const snap = await tx.stockSnapshot.findUnique({
                where: { itemId_locationId: { itemId: data.itemId, locationId: locId } }
            });
            if (snap) {
                const available = snap.quantityOnHand - snap.reservedQuantity;
                if (available < Math.abs(increment)) {
                    throw new BadRequestException(`Insufficient available stock at location ${locId}. OnHand: ${snap.quantityOnHand}, Reserved: ${snap.reservedQuantity}, Available: ${available}, Requested: ${Math.abs(increment)}`);
                }
            }
        }

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
        } else if (original.movementType === 'RETURN') {
            locationId = original.toLocationId;
            quantity = -original.quantity;
        } else if (original.movementType === 'TRANSFER') {
            // TRANSFER: fromLocationId -> toLocationId
            // REVERSAL of TRANSFER: toLocationId -> fromLocationId
            locationId = original.fromLocationId; // New Destination (Source of original)
            const sourceLocationId = original.toLocationId; // New Source (Destination of original)

            await this.recordMovement(tx, {
                itemId: original.itemId,
                locationId: locationId,
                relatedLocationId: sourceLocationId,
                movementType: 'REVERSAL',
                quantity: original.quantity, // quantity to move back
                reasonCodeId,
                reasonText: notes,
                userId,
                comments: `Reversal of Transfer ${original.referenceNo || ledgerId}. ${notes || ''}`,
                reversalOfLedgerId: ledgerId
            });
            return; // We handled it with the custom recordMovement call
        } else {
            throw new BadRequestException(`Reversal not implemented for movement type ${original.movementType}`);
        }

        await this.recordMovement(tx, {
            itemId: original.itemId,
            locationId: locationId,
            movementType: 'REVERSAL',
            quantity: quantity,
            reasonCodeId,
            reasonText: notes,
            userId,
            comments: `Reversal of ${original.referenceNo || ledgerId}. ${notes || ''}`,
            reversalOfLedgerId: ledgerId
        });
    }

    private async validateReasonPolicy(tx: any, code: any, quantity: number, unitCost: number, userId: string, text?: string) {
        if (code.requiresFreeText && !text) {
            throw new BadRequestException(`Reason code ${code.code} requires a description/text.`);
        }

        if (code.requiresApproval && code.approvalThreshold !== null) {
            const totalValue = quantity * unitCost;
            if (totalValue > code.approvalThreshold) {
                // Check if user has override permission
                const user = await tx.user.findUnique({
                    where: { id: userId },
                    include: {
                        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
                        permissions: { include: { permission: true } }
                    }
                });

                const hasOverride = user.roles.some((ur: any) => ur.role.permissions.some((rp: any) => rp.permission.resource === 'ledger' && rp.permission.action === 'override')) ||
                    user.permissions.some((up: any) => up.permission.resource === 'ledger' && up.permission.action === 'override');

                if (!hasOverride) {
                    throw new ForbiddenException(`Movement value (${totalValue}) exceeds approval threshold (${code.approvalThreshold}) for reason code ${code.code}.`);
                }
            }
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
                    where: {
                        isActive: true,
                        allowedMovements: { some: { movementType: 'RECEIVE' } }
                    },
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

    async returnStock(userId: string, data: { itemId: string, fromLocationId: string, toLocationId: string, quantity: number, reasonCodeId: string, comments?: string }) {
        return this.prisma.$transaction(async (tx) => {
            const fromLoc = await tx.location.findUnique({ where: { id: data.fromLocationId } });
            const toLoc = await tx.location.findUnique({ where: { id: data.toLocationId } });

            if (!fromLoc || fromLoc.type !== 'DEPARTMENT') {
                throw new BadRequestException('Return must originate from a DEPARTMENT location');
            }
            if (!toLoc || (toLoc.type !== 'STORE' && toLoc.type !== 'WAREHOUSE')) {
                throw new BadRequestException('Return must be directed to a STORE or WAREHOUSE location');
            }

            return this.recordMovement(tx, {
                itemId: data.itemId,
                locationId: data.toLocationId,
                relatedLocationId: data.fromLocationId,
                movementType: 'RETURN',
                quantity: data.quantity,
                reasonCodeId: data.reasonCodeId,
                reasonText: data.comments,
                userId,
                comments: data.comments
            });
        });
    }

    async findAllLocations() {
        return this.prisma.location.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllReasonCodes() {
        return this.prisma.reasonCode.findMany({
            where: { isActive: true },
            include: { allowedMovements: true },
            orderBy: { code: 'asc' },
        });
    }
    async findAllLedger(filters?: { itemId?: string; locationId?: string; movementType?: string }) {
        return this.prisma.inventoryLedger.findMany({
            where: {
                ...(filters?.itemId && { itemId: filters.itemId }),
                ...(filters?.movementType && { movementType: filters.movementType }),
                ...(filters?.locationId && {
                    OR: [
                        { fromLocationId: filters.locationId },
                        { toLocationId: filters.locationId },
                    ],
                }),
            },
            include: {
                item: true,
                fromLocation: true,
                toLocation: true,
                createdBy: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                reasonCode: true,
            },
            orderBy: {
                createdAtUtc: 'desc',
            },
        });
    }
}
