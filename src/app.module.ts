import { appConfig } from '@core/config/app.config';
import { validateEnv } from '@core/config/env.validation';
import { postgresConfig } from '@core/config/postgres.config';
import { redisConfig } from '@core/config/redis.config';
import { HealthModule } from '@core/health/health.module';
import { McpModule } from '@core/mcp/mcp.module';
import '@core/transport/graphql/registered-enums.graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SharedGraphQLModule } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesModule } from '@contexts/plant-species/plant-species.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    SupportModule,
    CqrsModule.forRoot(),
    SharedGraphQLModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [postgresConfig, appConfig, redisConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<TypeOrmModuleOptions>('postgres'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    HealthModule,
    McpModule,
    PlantSpeciesModule,
  ],
})
export class AppModule {}
