import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ItemsService } from './items.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';
import { ItemQueryDto } from '../common/dto/query.dto';

@ApiTags('catalog')
@ApiBearerAuth('JWT-auth')
@Controller('items')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @Get()
    @Permissions('items.read')
    @ApiOperation({ summary: 'Get all items with optional filters' })
    async findAll(@Query() query: ItemQueryDto) {
        return this.itemsService.findAll(query);
    }

    @Get(':id')
    @Permissions('items.read')
    @ApiOperation({ summary: 'Get item by ID' })
    async findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Post()
    @Permissions('items.create')
    @ApiOperation({ summary: 'Create new item' })
    @ApiBody({ type: CreateItemDto })
    async create(@Body() createDto: CreateItemDto) {
        return this.itemsService.create(createDto);
    }

    @Put(':id')
    @Permissions('items.update')
    @ApiOperation({ summary: 'Update item' })
    @ApiBody({ type: UpdateItemDto })
    async update(@Param('id') id: string, @Body() updateDto: UpdateItemDto) {
        return this.itemsService.update(id, updateDto);
    }

    @Post(':id/deactivate')
    @Permissions('items.deactivate')
    @ApiOperation({ summary: 'Deactivate item' })
    async deactivate(@Param('id') id: string) {
        return this.itemsService.deactivate(id);
    }

    @Post(':id/reactivate')
    @Permissions('items.activate')
    @ApiOperation({ summary: 'Reactivate item' })
    async reactivate(@Param('id') id: string) {
        return this.itemsService.reactivate(id);
    }

    @Get(':id/stock')
    @Permissions('stock.read')
    @ApiOperation({ summary: 'Get stock levels for item' })
    async getStockLevels(@Param('id') id: string) {
        return this.itemsService.getStockLevels(id);
    }

    @Get('categories')
    @Permissions('items.read')
    @ApiOperation({ summary: 'Get all categories' })
    async getCategories() {
        return this.itemsService.findAllCategories();
    }
}
