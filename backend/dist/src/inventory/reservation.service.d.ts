import { PrismaService } from '../prisma/prisma.service';
export declare class ReservationService {
    private prisma;
    constructor(prisma: PrismaService);
    reserve(data: any): Promise<void>;
    release(data: any): Promise<void>;
}
