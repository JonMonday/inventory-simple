import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.item.findMany({
            include: {
                category: true,
                uom: true,
                snapshots: {
                    include: {
                        location: true,
                    }
                }
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.item.findUnique({
            where: { id },
            include: {
                category: true,
                uom: true,
                snapshots: true,
            },
        });
    }

    async create(data: any) {
        return this.prisma.item.create({
            data,
        });
    }

    async update(id: string, data: any) {
        return this.prisma.item.update({
            where: { id },
            data,
        });
    }
}
