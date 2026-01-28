import { Controller, Post, Body, UseGuards, Req, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { RestockDto } from './dto/restock.dto';
import { ReturnDto } from './dto/return.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { TransferDto } from './dto/transfer.dto';
import { AdjustDto } from './dto/adjust.dto';
import { AvailabilityCheckDto } from './dto/availability.dto';

@ApiTags('inventory')
@ApiBearerAuth('JWT-auth')
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
    @Permissions('inventory.return')
    async return(@Req() req: any, @Body() dto: ReturnDto) {
        return this.inventoryService.returnStock(req.user.id, dto);
    }

    @Post('transfer')
    @Permissions('inventory.transfer')
    async transfer(@Req() req: any, @Body() dto: TransferDto) {
        return this.inventoryService.transfer(req.user.id, dto);
    }

    @Post('adjust')
    @Permissions('inventory.adjust')
    async adjust(@Req() req: any, @Body() dto: AdjustDto) {
        return this.inventoryService.adjust(req.user.id, dto);
    }

    @Post('availability')
    @Permissions('stock.read')
    async checkAvailability(@Body() dto: AvailabilityCheckDto) {
        const snapshot = await this.inventoryService.getSnapshot(dto.itemId, dto.storeLocationId);
        return {
            available: (snapshot.quantityOnHand - snapshot.reservedQuantity) >= dto.quantity,
            quantityOnHand: snapshot.quantityOnHand,
            reservedQuantity: snapshot.reservedQuantity,
            readyToIssue: snapshot.quantityOnHand - snapshot.reservedQuantity
        };
    }

    @Get('stock-snapshots')
    @Permissions('stock.read')
    async getSnapshots(@Query() query: { itemId?: string; storeId?: string }) {
        return this.inventoryService.getStockSnapshots(query);
    }

    @Get('stock-snapshots/:iid/:sid')
    @Permissions('stock.read')
    async getSnapshot(@Param('iid') iid: string, @Param('sid') sid: string) {
        return this.inventoryService.getSnapshot(iid, sid);
    }

    @Get('locations')
    @Permissions('storeLocations.read')
    async getLocations() {
        return this.inventoryService.findAllLocations();
    }

    @Get('reason-codes')
    @Permissions('reasonCodes.read')
    async getReasonCodes() {
        return this.inventoryService.findAllReasonCodes();
    }
}

// Separate Controller for Diag if preferred, but for now here
@Controller('reservations')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ReservationsController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get()
    @Permissions('reservations.read')
    async getGlobalReservations() {
        return this.inventoryService.getGlobalReservations();
    }
}
