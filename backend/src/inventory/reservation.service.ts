import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) { }

    /**
     * Reserves stock for a request line.
     * MUST be called within a transaction.
     */
    async reserve(tx: Prisma.TransactionClient, requestLineId: string, itemId: string, locationId: string, quantity: number) {
        // 1. Check Availability
        // We need to fetch the snapshot carefully.
        // Ideally we lock the row, but in SQLite/Prisma simple read-modify-write in transaction is usually okay for single app instance.
        // For robust concurrency, we might want raw SQL or optimistic concurrency.
        // Here we rely on the transaction serialization of SQLite or Prisma's interactive transaction.

        // Ensure snapshot exists or create (though if receiving created it, it exists. If not, maybe 0 stock)
        let snapshot = await tx.stockSnapshot.findUnique({
            where: { itemId_locationId: { itemId, locationId } },
        });

        if (!snapshot) {
            // If no snapshot, assuming 0 stock, so cannot reserve.
            throw new BadRequestException(`No stock snapshot found for item ${itemId} at location ${locationId}`);
        }

        const available = snapshot.quantityOnHand - snapshot.reservedQuantity;
        if (available < quantity) {
            throw new BadRequestException(`Insufficient available stock. Requested: ${quantity}, Available: ${available}`);
        }

        // 2. Update Snapshot
        await tx.stockSnapshot.update({
            where: { itemId_locationId: { itemId, locationId } },
            data: {
                reservedQuantity: { increment: quantity },
            },
        });

        // 3. Create Reservation Record
        await tx.reservation.create({
            data: {
                requestLineId,
                itemId,
                locationId,
                quantity,
            },
        });
    }

    /**
     * Releases reservation for a request line (e.g. rejection or revert to review).
     */
    async release(tx: Prisma.TransactionClient, requestLineId: string) {
        const reservation = await tx.reservation.findUnique({
            where: { requestLineId },
        });

        if (!reservation) return; // Nothing to release

        // 1. Decrement Reserved Qty
        await tx.stockSnapshot.update({
            where: { itemId_locationId: { itemId: reservation.itemId, locationId: reservation.locationId } },
            data: {
                reservedQuantity: { decrement: reservation.quantity },
            },
        });

        // 2. Delete Reservation
        await tx.reservation.delete({
            where: { id: reservation.id },
        });
    }

    /**
     * Commits a reservation (Fulfillment).
     * Basically just deletes the reservation record and decrements reservedQuantity.
     * The actual inventory issue (decrementing onHand) happens in the caller (InventoryService/RequestsService).
     */
    async commit(tx: Prisma.TransactionClient, requestLineId: string) {
        // Releasing is effectively the same as committing regarding reservation removal.
        // The difference is that the caller will ALSO decrement onHand.
        await this.release(tx, requestLineId);
    }
}
