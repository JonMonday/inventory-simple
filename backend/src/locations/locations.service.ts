import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.location.findMany();
    }

    async create(data: any) {
        return this.prisma.location.create({
            data,
        });
    }
}
