import { Module } from '@nestjs/common';
import { StocktakeService } from './stocktake.service';
import { StocktakeController } from './stocktake.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [PrismaModule, InventoryModule],
    providers: [StocktakeService],
    controllers: [StocktakeController],
})
export class StocktakeModule { }
