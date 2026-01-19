import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { RestockDto } from './dto/restock.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('receive')
    @Permissions('inventory.receive')
    async receive(@Req() req: any, @Body() dto: RestockDto) {
        return this.inventoryService.receive(req.user.id, dto);
    }
}
