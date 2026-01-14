import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class ImportsProcessor extends WorkerHost {
    private prisma;
    constructor(prisma: PrismaService);
    process(job: Job<any, any, string>): Promise<any>;
    private processStockSheet;
    private processDataSheet;
}
