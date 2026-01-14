import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Get()
    @Permissions('items.read')
    findAll() {
        return this.itemsService.findAll();
    }

    @Get(':id')
    @Permissions('items.read')
    findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Post()
    @Permissions('items.create')
    create(@Body() data: any) {
        return this.itemsService.create(data);
    }

    @Put(':id')
    @Permissions('items.update')
    update(@Param('id') id: string, @Body() data: any) {
        return this.itemsService.update(id, data);
    }
}
