import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class ImportsService {
    private importQueue;
    private prisma;
    constructor(importQueue: Queue, prisma: PrismaService);
    createImportJob(file: Express.Multer.File, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        filename: string;
        fileHash: string | null;
        status: string;
        errorLog: import("@prisma/client/runtime/library").JsonValue | null;
        rowCount: number;
        processedAt: Date | null;
    }>;
    getImportStatus(jobId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        filename: string;
        fileHash: string | null;
        status: string;
        errorLog: import("@prisma/client/runtime/library").JsonValue | null;
        rowCount: number;
        processedAt: Date | null;
    } | null>;
}
