import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('ledger')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LedgerController {
    constructor(private readonly ledgerService: LedgerService) { }

    @Post()
    @Permissions('ledger.create')
    create(@Body() data: any, @Request() req: any) {
        return this.ledgerService.createEntry({
            ...data,
            userId: req.user.id,
        });
    }

    @Get()
    @Permissions('ledger.read')
    findAll(@Query() filters: any) {
        return this.ledgerService.getLedger(filters);
    }
}
