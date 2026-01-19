import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ItemsService } from './items.service';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('items')
@UseGuards(AuthGuard('jwt'))
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @Get()
    @Permissions('items.read')
    async findAll(
        @Query('categoryId') categoryId?: string,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ) {
        return this.itemsService.findAll({ categoryId, status, search });
    }

    @Get(':id')
    @Permissions('items.read')
    async findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Post()
    @Permissions('items.create')
    async create(
        @Body()
        createDto: {
            code: string;
            name: string;
            description?: string;
            categoryId: string;
            unitOfMeasure: string;
            reorderLevel?: number;
            reorderQuantity?: number;
        },
    ) {
        return this.itemsService.create(createDto);
    }

    @Put(':id')
    @Permissions('items.update')
    async update(
        @Param('id') id: string,
        @Body()
        updateDto: {
            name?: string;
            description?: string;
            categoryId?: string;
            unitOfMeasure?: string;
            status?: string;
            reorderLevel?: number;
            reorderQuantity?: number;
        },
    ) {
        return this.itemsService.update(id, updateDto);
    }

    @Delete(':id')
    @Permissions('items.delete')
    async delete(@Param('id') id: string) {
        return this.itemsService.delete(id);
    }

    @Get(':id/stock')
    @Permissions('stock.read')
    async getStockLevels(@Param('id') id: string) {
        return this.itemsService.getStockLevels(id);
    }
}
