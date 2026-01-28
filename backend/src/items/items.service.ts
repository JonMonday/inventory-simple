import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: {
        categoryId?: string;
        status?: string;
        search?: string;
    }) {
        return this.prisma.item.findMany({
            where: {
                ...(filters?.categoryId && { categoryId: filters.categoryId }),
                ...(filters?.status && { status: { code: filters.status } }),
                ...(filters?.search && {
                    OR: [
                        { code: { contains: filters.search } },
                        { name: { contains: filters.search } },
                        { description: { contains: filters.search } },
                    ],
                }),
            },
            include: {
                category: true,
                stockSnapshots: {
                    include: {
                        storeLocation: true,
                    },
                },
            },
            orderBy: {
                code: 'asc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.item.findUnique({
            where: { id },
            include: {
                category: true,
                stockSnapshots: {
                    include: {
                        storeLocation: true,
                    },
                },
            },
        });
    }

    async create(data: {
        code: string;
        name: string;
        description?: string;
        categoryId: string;
        unitOfMeasure: string;
        reorderLevel?: number;
        reorderQuantity?: number;
    }) {
        return this.prisma.item.create({
            data: {
                ...data,
                status: { connect: { code: 'ACTIVE' } },
            } as any,
            include: {
                category: true,
            },
        });
    }

    async update(
        id: string,
        data: {
            name?: string;
            description?: string;
            categoryId?: string;
            unitOfMeasure?: string;
            status?: string;
            reorderLevel?: number;
            reorderQuantity?: number;
        },
    ) {
        return this.prisma.item.update({
            where: { id },
            data: {
                ...data,
                ...(data.status && { status: { connect: { code: data.status } } })
            } as any,
            include: {
                category: true,
            },
        });
    }

    async deactivate(id: string) {
        // Soft toggle by marking as DISCONTINUED
        return this.prisma.item.update({
            where: { id },
            data: { status: { connect: { code: 'DISCONTINUED' } } },
        });
    }

    async reactivate(id: string) {
        // Soft toggle back to ACTIVE
        return this.prisma.item.update({
            where: { id },
            data: { status: { connect: { code: 'ACTIVE' } } },
        });
    }

    async getStockLevels(itemId: string) {
        return this.prisma.stockSnapshot.findMany({
            where: { itemId },
            include: {
                storeLocation: true,
            },
        });
    }

    async findAllCategories() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
