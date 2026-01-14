import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import * as crypto from 'crypto';

@Injectable()
export class ImportsService {
    constructor(
        @InjectQueue('import-queue') private importQueue: Queue,
        private prisma: PrismaService,
    ) { }

    async createImportJob(file: Express.Multer.File, userId: string) {
        const fileHash = crypto.createHash('md5').update(file.buffer).digest('hex');

        const job = await this.prisma.importJob.create({
            data: {
                filename: file.originalname,
                fileHash,
                userId,
                status: 'PENDING',
            },
        });

        await this.importQueue.add('process-inventory-excel', {
            jobId: job.id,
            fileBase64: file.buffer.toString('base64'),
        });

        return job;
    }

    async getImportStatus(jobId: string) {
        return this.prisma.importJob.findUnique({
            where: { id: jobId },
        });
    }
}
