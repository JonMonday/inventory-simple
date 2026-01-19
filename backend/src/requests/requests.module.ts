import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [PrismaModule, InventoryModule],
    providers: [RequestsService],
    controllers: [RequestsController],
    exports: [RequestsService],
})
export class RequestsModule { }
