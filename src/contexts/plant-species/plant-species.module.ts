import { Module, Provider, Type } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Plant Species bounded context.
 *
 * Skeleton wired with DDD + CQRS + Hexagonal layout:
 *   application/  → commands, queries, ports, services (read/write)
 *   domain/       → aggregates, builders, events, value-objects, repositories…
 *   infrastructure/ → persistence (typeorm), adapters
 *   transport/    → rest, graphql, mcp
 *
 * Register handlers, repositories, mappers and controllers below as you build
 * them out, e.g.:
 *
 *   const COMMAND_HANDLERS = [CreatePlantSpeciesCommandHandler];
 *   const INFRASTRUCTURE_REPOSITORIES = [
 *     { provide: PLANT_SPECIES_WRITE_REPOSITORY, useClass: PlantSpeciesTypeOrmWriteRepository },
 *   ];
 */

const COMMAND_HANDLERS: Provider[] = [];
const QUERY_HANDLERS: Provider[] = [];
const APPLICATION_SERVICES: Provider[] = [];
const DOMAIN_BUILDERS: Provider[] = [];
const INFRASTRUCTURE_MAPPERS: Provider[] = [];
const INFRASTRUCTURE_REPOSITORIES: Provider[] = [];
const INFRASTRUCTURE_ADAPTERS: Provider[] = [];
const REST_CONTROLLERS: Type<unknown>[] = [];
const REST_PROVIDERS: Provider[] = [];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([])],
  controllers: [...REST_CONTROLLERS],
  providers: [
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    ...APPLICATION_SERVICES,
    ...DOMAIN_BUILDERS,
    ...INFRASTRUCTURE_MAPPERS,
    ...INFRASTRUCTURE_REPOSITORIES,
    ...INFRASTRUCTURE_ADAPTERS,
    ...REST_PROVIDERS,
  ],
  exports: [],
})
export class PlantSpeciesModule {}
