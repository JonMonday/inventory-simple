import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.requestTemplate.findMany({
            where: { isActive: true },
            include: { workflowSteps: { include: { stageType: true } } }
        });
    }

    async findOne(id: string) {
        const template = await this.prisma.requestTemplate.findUnique({
            where: { id },
            include: {
                workflowSteps: {
                    include: { stageType: true, department: true, unit: true, jobRole: true },
                    orderBy: { stepOrder: 'asc' }
                },
                templateLines: { include: { item: true } }
            }
        });
        if (!template) throw new NotFoundException('Template not found');
        return template;
    }
}
