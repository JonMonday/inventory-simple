import { Controller, Post, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { ReverseDto } from './dto/reverse.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('ledger')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LedgerController {
    constructor(
        private readonly inventoryService: InventoryService,
        private readonly prisma: PrismaService,
    ) { }

    @Get()
    @Permissions('ledger.read')
    async findAll() {
        return this.inventoryService.findAllLedger();
    }

    @Post(':id/reverse')
    @Permissions('ledger.reverse')
    async reverse(@Param('id') id: string, @Req() req: any, @Body() dto: ReverseDto) {
        return this.prisma.$transaction(async (tx) => {
            return this.inventoryService.reverseLedgerEntry(tx, id, req.user.id, dto.reasonCodeId, dto.notes);
        });
    }
}
