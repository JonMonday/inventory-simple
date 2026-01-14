import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LedgerService {
    constructor(private prisma: PrismaService) { }

    async createEntry(data: any) {
        const {
            itemId,
            fromLocationId,
            toLocationId,
            movementType,
            quantity,
            userId,
            reasonCodeId,
            ...rest
        } = data;

        return (this.prisma as any).$transaction(async (tx: any) => {
            // 1. Create Ledger Entry
            const ledgerEntry = await tx.inventoryLedger.create({
                data: {
                    item: { connect: { id: itemId } },
                    fromLocation: fromLocationId ? { connect: { id: fromLocationId } } : undefined,
                    toLocation: toLocationId ? { connect: { id: toLocationId } } : undefined,
                    movementType,
                    quantity,
                    reasonCode: { connect: { id: reasonCodeId } },
                    createdBy: { connect: { id: userId } },
                    ...rest,
                },
            });

            // 2. Update Snapshots
            if (fromLocationId) {
                await this.updateSnapshot(tx, itemId, fromLocationId, -quantity);
            }
            if (toLocationId) {
                await this.updateSnapshot(tx, itemId, toLocationId, quantity);
            }

            return ledgerEntry;
        });
    }

    private async updateSnapshot(tx: any, itemId: string, locationId: string, quantity: number) {
        const snapshot = await tx.stockSnapshot.upsert({
            where: {
                itemId_locationId: {
                    itemId,
                    locationId,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                itemId,
                locationId,
                quantity,
            },
        });

        // Enforce constraints: quantities > 0
        if (snapshot.quantity < 0) {
            // Check for 'allow_negative' permission might happen here if we pass user context
            // For now, strict:
            throw new BadRequestException('Stock cannot be negative at this location');
        }

        return snapshot;
    }

    async getLedger(filters: any) {
        return this.prisma.inventoryLedger.findMany({
            where: filters,
            include: {
                item: true,
                fromLocation: true,
                toLocation: true,
                reasonCode: true,
                createdBy: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
