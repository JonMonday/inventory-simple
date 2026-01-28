import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Serverless-safe singleton pattern for Vercel
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // Reuse existing PrismaClient instance in serverless environments
        if (globalForPrisma.prisma) {
            return globalForPrisma.prisma as PrismaService;
        }

        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });

        globalForPrisma.prisma = this;
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
