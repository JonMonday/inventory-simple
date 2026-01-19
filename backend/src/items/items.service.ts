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
                ...(filters?.status && { status: filters.status }),
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
                        location: true,
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
                status: 'ACTIVE',
            },
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
            data,
            include: {
                category: true,
            },
        });
    }

    async delete(id: string) {
        // Soft delete by marking as discontinued
        return this.prisma.item.update({
            where: { id },
            data: { status: 'DISCONTINUED' },
        });
    }

    async getStockLevels(itemId: string) {
        return this.prisma.stockSnapshot.findMany({
            where: { itemId },
            include: {
                location: true,
            },
        });
    }
}
