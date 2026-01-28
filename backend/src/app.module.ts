import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { InventoryModule } from './inventory/inventory.module';
// import { StocktakeModule } from './stocktake/stocktake.module';
// import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { TemplatesModule } from './templates/templates.module';
import { MetadataModule } from './metadata/metadata.module';
import { CommonModule } from './common/common.module';
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
    // StocktakeModule,
    // ReportsModule,
    OrganizationModule,
    TemplatesModule,
    MetadataModule,
    CommonModule,
  ],
  providers: [],
})
export class AppModule { }
// Logic: Force Rebuild
