import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { LedgerModule } from './ledger/ledger.module';
import { LocationsModule } from './locations/locations.module';
import { ImportsModule } from './imports/imports.module';
import { ForecastingModule } from './forecasting/forecasting.module';
import { BrandingModule } from './branding/branding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    LedgerModule,
    LocationsModule,
    ImportsModule,
    ForecastingModule,
    BrandingModule,
  ],
})
export class AppModule { }
