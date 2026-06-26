import '@contexts/plant-species/transport/graphql/enums/plant-species-registered-enums.graphql';

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreatePlantSpeciesCommandHandler } from './application/commands/create-plant-species/create-plant-species.handler';
import { DeletePlantSpeciesCommandHandler } from './application/commands/delete-plant-species/delete-plant-species.handler';
import { IngestPlantSpeciesCommandHandler } from './application/commands/ingest-plant-species/ingest-plant-species.handler';
import { UpdatePlantSpeciesCommandHandler } from './application/commands/update-plant-species/update-plant-species.handler';
import { PLANT_SPECIES_QUEUE_PORT } from './application/ports/plant-species-queue.port';
import { PLANT_SPECIES_REFERENCE_PORT } from './application/ports/plant-species-reference.port';
import { PlantSpeciesFindByCriteriaQueryHandler } from './application/queries/plant-species-find-by-criteria/plant-species-find-by-criteria.handler';
import { PlantSpeciesFindByIdQueryHandler } from './application/queries/plant-species-find-by-id/plant-species-find-by-id.handler';
import { AssertPlantSpeciesViewModelExistsService } from './application/services/read/assert-plant-species-view-model-exists/assert-plant-species-view-model-exists.service';
import { AssertPlantSpeciesExistsService } from './application/services/write/assert-plant-species-exists/assert-plant-species-exists.service';
import { AssertPlantSpeciesNameAvailableService } from './application/services/write/assert-plant-species-name-available/assert-plant-species-name-available.service';
import { AssertPlantSpeciesNotInUseService } from './application/services/write/assert-plant-species-not-in-use/assert-plant-species-not-in-use.service';
import { PlantSpeciesBuilder } from './domain/builders/plant-species.builder';
import { PLANT_SPECIES_READ_REPOSITORY } from './domain/repositories/read/plant-species-read.repository';
import { PLANT_SPECIES_WRITE_REPOSITORY } from './domain/repositories/write/plant-species-write.repository';
import { PlantSpeciesReferenceAdapter } from './infrastructure/adapters/plant-species-reference.adapter';
import { RedisPlantSpeciesQueueAdapter } from './infrastructure/adapters/redis-plant-species-queue.adapter';
import { plantSpeciesRedisClientProvider } from './infrastructure/redis/plant-species-redis.client';
import { PlantSpeciesCommonNameTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/plant-species-common-name.entity';
import { PlantSpeciesExternalIdTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/plant-species-external-id.entity';
import { PlantSpeciesImageTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/plant-species-image.entity';
import { PlantSpeciesTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/plant-species.entity';
import { PlantSpeciesTypeOrmMapper } from './infrastructure/persistence/typeorm/mappers/plant-species-typeorm.mapper';
import { PlantSpeciesTypeOrmReadRepository } from './infrastructure/persistence/typeorm/repositories/plant-species-typeorm-read.repository';
import { PlantSpeciesTypeOrmWriteRepository } from './infrastructure/persistence/typeorm/repositories/plant-species-typeorm-write.repository';
import { PlantSpeciesCreateMcpTool } from './transport/mcp/tools/plant-species-create.tool';
import { PlantSpeciesDeleteMcpTool } from './transport/mcp/tools/plant-species-delete.tool';
import { PlantSpeciesFindByCriteriaMcpTool } from './transport/mcp/tools/plant-species-find-by-criteria.tool';
import { PlantSpeciesFindByIdMcpTool } from './transport/mcp/tools/plant-species-find-by-id.tool';
import { PlantSpeciesIngestMcpTool } from './transport/mcp/tools/plant-species-ingest.tool';
import { PlantSpeciesUpdateMcpTool } from './transport/mcp/tools/plant-species-update.tool';
import { PlantSpeciesGraphQLMapper } from './transport/graphql/mappers/plant-species.mapper';
import { PlantSpeciesMutationsResolver } from './transport/graphql/resolvers/plant-species-mutations.resolver';
import { PlantSpeciesQueriesResolver } from './transport/graphql/resolvers/plant-species-queries.resolver';
import { PlantSpeciesController } from './transport/rest/controllers/plant-species.controller';
import { PlantSpeciesRestMapper } from './transport/rest/mappers/plant-species/plant-species.mapper';

const COMMAND_HANDLERS = [
  CreatePlantSpeciesCommandHandler,
  UpdatePlantSpeciesCommandHandler,
  DeletePlantSpeciesCommandHandler,
  IngestPlantSpeciesCommandHandler,
];

const QUERY_HANDLERS = [
  PlantSpeciesFindByIdQueryHandler,
  PlantSpeciesFindByCriteriaQueryHandler,
];

const APPLICATION_SERVICES = [
  AssertPlantSpeciesViewModelExistsService,
  AssertPlantSpeciesExistsService,
  AssertPlantSpeciesNameAvailableService,
  AssertPlantSpeciesNotInUseService,
];

const DOMAIN_BUILDERS = [PlantSpeciesBuilder];

const INFRASTRUCTURE_ENTITIES = [
  PlantSpeciesTypeOrmEntity,
  PlantSpeciesCommonNameTypeOrmEntity,
  PlantSpeciesImageTypeOrmEntity,
  PlantSpeciesExternalIdTypeOrmEntity,
];

const INFRASTRUCTURE_MAPPERS = [PlantSpeciesTypeOrmMapper];

const INFRASTRUCTURE_REPOSITORIES = [
  {
    provide: PLANT_SPECIES_READ_REPOSITORY,
    useClass: PlantSpeciesTypeOrmReadRepository,
  },
  {
    provide: PLANT_SPECIES_WRITE_REPOSITORY,
    useClass: PlantSpeciesTypeOrmWriteRepository,
  },
];

const INFRASTRUCTURE_ADAPTERS = [
  plantSpeciesRedisClientProvider,
  {
    provide: PLANT_SPECIES_REFERENCE_PORT,
    useClass: PlantSpeciesReferenceAdapter,
  },
  {
    provide: PLANT_SPECIES_QUEUE_PORT,
    useClass: RedisPlantSpeciesQueueAdapter,
  },
];

const REST_CONTROLLERS = [PlantSpeciesController];

const TRANSPORT_PROVIDERS = [
  PlantSpeciesRestMapper,
  PlantSpeciesQueriesResolver,
  PlantSpeciesMutationsResolver,
  PlantSpeciesGraphQLMapper,
  PlantSpeciesCreateMcpTool,
  PlantSpeciesUpdateMcpTool,
  PlantSpeciesDeleteMcpTool,
  PlantSpeciesIngestMcpTool,
  PlantSpeciesFindByIdMcpTool,
  PlantSpeciesFindByCriteriaMcpTool,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(INFRASTRUCTURE_ENTITIES)],
  controllers: [...REST_CONTROLLERS],
  providers: [
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    ...APPLICATION_SERVICES,
    ...DOMAIN_BUILDERS,
    ...INFRASTRUCTURE_MAPPERS,
    ...INFRASTRUCTURE_REPOSITORIES,
    ...INFRASTRUCTURE_ADAPTERS,
    ...TRANSPORT_PROVIDERS,
  ],
  exports: [],
})
export class PlantSpeciesModule {}
