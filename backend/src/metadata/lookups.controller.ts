import { Controller, Get, Post, Patch, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { LookupRegistryGuard } from '../common/guards/lookup-registry.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('lookups')
@UseGuards(AuthGuard('jwt'), PermissionsGuard, LookupRegistryGuard)
export class LookupsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @Permissions('lookups.read')
    async listTables() {
        // Registry is defined in the Guard, but for the API we can list them
        return [
            'request_statuses',
            'request_stage_types',
            'request_event_types',
            'comment_types',
            'participant_role_types',
            'ledger_movement_types',
            'stocktake_statuses',
            'item_statuses'
        ];
    }

    @Get(':name')
    @Permissions('lookups.read')
    async getTableData(@Param('name') name: string) {
        return (this.prisma as any)[name].findMany({ orderBy: { label: 'asc' } });
    }

    @Post(':name')
    @Permissions('lookups.manage')
    async createEntry(@Param('name') name: string, @Body() body: any) {
        return (this.prisma as any)[name].create({ data: body });
    }

    @Patch(':name/:id')
    @Permissions('lookups.manage')
    async updateEntry(@Param('name') name: string, @Param('id') id: string, @Body() body: any) {
        return (this.prisma as any)[name].update({ where: { id }, data: body });
    }

    @Post(':name/:id/activate')
    @Permissions('lookups.manage')
    async activateEntry(@Param('name') name: string, @Param('id') id: string) {
        return (this.prisma as any)[name].update({ where: { id }, data: { isActive: true } });
    }

    @Post(':name/:id/deactivate')
    @Permissions('lookups.manage')
    async deactivateEntry(@Param('name') name: string, @Param('id') id: string) {
        return (this.prisma as any)[name].update({ where: { id }, data: { isActive: false } });
    }
}
