import { appConfig } from '@core/config/app.config';
import { validateEnv } from '@core/config/env.validation';
import { postgresConfig } from '@core/config/postgres.config';
import { HealthModule } from '@core/health/health.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PlantSpeciesModule } from '@contexts/plant-species/plant-species.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    SupportModule,
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [postgresConfig, appConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<TypeOrmModuleOptions>('postgres'),
    }),
    HealthModule,
    PlantSpeciesModule,
  ],
})
export class AppModule {}
