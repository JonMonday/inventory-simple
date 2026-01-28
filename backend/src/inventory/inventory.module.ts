import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ReservationService } from './reservation.service';
import { InventoryController, ReservationsController } from './inventory.controller';
import { LedgerController } from './ledger.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [InventoryService, ReservationService],
    controllers: [InventoryController, LedgerController, ReservationsController],
    exports: [InventoryService, ReservationService],
})
export class InventoryModule { }
