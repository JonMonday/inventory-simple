import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { InventoryModule } from './inventory/inventory.module';
import { StocktakeModule } from './stocktake/stocktake.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { LocationsModule } from './locations/locations.module';
import { PermissionsGuard } from './common/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ItemsModule,
    UsersModule,
    RequestsModule,
    InventoryModule,
    StocktakeModule,
    ReportsModule,
    LocationsModule,
  ],
  providers: [],
})
export class AppModule { }
