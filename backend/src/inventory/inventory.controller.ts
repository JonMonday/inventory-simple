import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { RestockDto } from './dto/restock.dto';
import { ReturnDto } from './dto/return.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('receive')
    @Permissions('inventory.receive')
    async receive(@Req() req: any, @Body() dto: RestockDto) {
        return this.inventoryService.receive(req.user.id, dto);
    }

    @Post('return')
    @Permissions('inventory.return') // Returns are similar to receiving in terms of permission level
    async return(@Req() req: any, @Body() dto: ReturnDto) {
        return this.inventoryService.returnStock(req.user.id, dto);
    }

    @Get('locations')
    async getLocations() {
        return this.inventoryService.findAllLocations();
    }

    @Get('reason-codes')
    async getReasonCodes() {
        return this.inventoryService.findAllReasonCodes();
    }
}
