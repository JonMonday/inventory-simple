import { Controller, Get, Post, Put, Body, Param, UseGuards, NotFoundException, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('templates')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class TemplatesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @Permissions('templates.read')
    async findAll() {
        return this.prisma.requestTemplate.findMany({
            include: { workflowSteps: { include: { stageType: true } } },
            orderBy: { isDefault: 'desc' }
        });
    }

    @Get(':id')
    @Permissions('templates.read')
    async findOne(@Param('id') id: string) {
        const t = await this.prisma.requestTemplate.findUnique({
            where: { id },
            include: { workflowSteps: { include: { stageType: true, department: true, unit: true, jobRole: true }, orderBy: { stepOrder: 'asc' } } }
        });
        if (!t) throw new NotFoundException('Template not found');
        return t;
    }

    @Post()
    @Permissions('templates.create')
    async create(@Req() req: any, @Body() body: any) {
        return this.prisma.requestTemplate.create({
            data: {
                name: body.name,
                description: body.description,
                createdById: req.user.id,
                workflowSteps: {
                    create: (body.steps || []).map((s: any) => ({
                        stageTypeId: s.stageTypeId,
                        stepOrder: s.stepOrder,
                        departmentId: s.departmentId,
                        unitId: s.unitId,
                        jobRoleId: s.jobRoleId
                    }))
                }
            }
        });
    }

    @Put(':id')
    @Permissions('templates.update')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.prisma.$transaction(async (tx) => {
            if (body.steps) {
                await tx.templateWorkflowStep.deleteMany({ where: { templateId: id } });
            }

            return tx.requestTemplate.update({
                where: { id },
                data: {
                    name: body.name,
                    description: body.description,
                    ...(body.steps && {
                        workflowSteps: {
                            create: body.steps.map((s: any) => ({
                                stageTypeId: s.stageTypeId,
                                stepOrder: s.stepOrder,
                                departmentId: s.departmentId,
                                unitId: s.unitId,
                                jobRoleId: s.jobRoleId
                            }))
                        }
                    })
                }
            });
        });
    }

    @Post(':id/activate')
    @Permissions('templates.activate')
    async activate(@Param('id') id: string) {
        return this.prisma.requestTemplate.update({ where: { id }, data: { isActive: true } });
    }

    @Post(':id/deactivate')
    @Permissions('templates.deactivate')
    async deactivate(@Param('id') id: string) {
        return this.prisma.requestTemplate.update({ where: { id }, data: { isActive: false } });
    }

    @Post(':id/set-default')
    @Permissions('templates.manage')
    async setDefault(@Param('id') id: string) {
        return this.prisma.$transaction(async (tx) => {
            await tx.requestTemplate.updateMany({ data: { isDefault: false } });
            return tx.requestTemplate.update({ where: { id }, data: { isDefault: true } });
        });
    }

    @Post(':id/validate')
    @Permissions('templates.read')
    async validate(@Param('id') id: string) {
        const template: any = await this.findOne(id);
        const issues = [];

        const steps = template.workflowSteps || [];
        const orders = steps.map((s: any) => s.stepOrder).sort((a: number, b: number) => a - b);

        for (let i = 0; i < orders.length - 1; i++) {
            if (orders[i + 1] !== orders[i] + 1) {
                issues.push(`Gap in step order detected between ${orders[i]} and ${orders[i + 1]}`);
            }
        }

        return {
            valid: issues.length === 0,
            issues,
            stepCount: steps.length
        };
    }
}
