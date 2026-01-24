import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ReservationService {
    private prisma;
    constructor(prisma: PrismaService);
    reserve(tx: Prisma.TransactionClient, requestLineId: string, itemId: string, locationId: string, quantity: number): Promise<void>;
    release(tx: Prisma.TransactionClient, requestLineId: string): Promise<void>;
    commit(tx: Prisma.TransactionClient, requestLineId: string): Promise<void>;
}
