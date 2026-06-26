import { Criteria, DateValueObject } from '@sisques-labs/nestjs-kit';
import { DataSource, Repository } from 'typeorm';

import { PlantSpeciesAggregate } from '@contexts/plant-species/domain/aggregates/plant-species.aggregate';
import { PlantSpeciesBuilder } from '@contexts/plant-species/domain/builders/plant-species.builder';
import { PlantSpeciesIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-id/plant-species-id.value-object';
import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';
import { PlantSpeciesCommonNameTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-common-name.entity';
import { PlantSpeciesExternalIdTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-external-id.entity';
import { PlantSpeciesImageTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-image.entity';
import { PlantSpeciesTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species.entity';
import { PlantSpeciesTypeOrmMapper } from '@contexts/plant-species/infrastructure/persistence/typeorm/mappers/plant-species-typeorm.mapper';
import { PlantSpeciesTypeOrmReadRepository } from '@contexts/plant-species/infrastructure/persistence/typeorm/repositories/plant-species-typeorm-read.repository';
import { PlantSpeciesTypeOrmWriteRepository } from '@contexts/plant-species/infrastructure/persistence/typeorm/repositories/plant-species-typeorm-write.repository';

const ENTITIES = [
  PlantSpeciesTypeOrmEntity,
  PlantSpeciesCommonNameTypeOrmEntity,
  PlantSpeciesImageTypeOrmEntity,
  PlantSpeciesExternalIdTypeOrmEntity,
];

const NOW = new Date('2024-01-01T00:00:00.000Z');

const buildAggregate = (
  id: string,
  scientificName: string,
): PlantSpeciesAggregate =>
  new PlantSpeciesAggregate({
    id: new PlantSpeciesIdValueObject(id),
    scientificName: new PlantSpeciesScientificNameValueObject(scientificName),
    description: null,
    imageUrl: null,
    classification: null,
    authorship: null,
    growthHabit: null,
    wikipediaUrl: null,
    commonNames: [],
    images: [],
    externalIds: [],
    createdAt: new DateValueObject(NOW),
    updatedAt: new DateValueObject(NOW),
  });

describe('PlantSpecies TypeORM repositories (integration)', () => {
  let dataSource: DataSource;
  let entityRepo: Repository<PlantSpeciesTypeOrmEntity>;
  let writeRepository: PlantSpeciesTypeOrmWriteRepository;
  let readRepository: PlantSpeciesTypeOrmReadRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT ?? 5435),
      username: process.env.DATABASE_USERNAME ?? 'gardenia',
      password: process.env.DATABASE_PASSWORD ?? 'gardenia',
      database: process.env.DATABASE_DATABASE ?? 'gardenia_plant_species_test',
      entities: ENTITIES,
      synchronize: true,
      dropSchema: true,
    });

    await dataSource.initialize();

    entityRepo = dataSource.getRepository(PlantSpeciesTypeOrmEntity);
    const mapper = new PlantSpeciesTypeOrmMapper(new PlantSpeciesBuilder());
    writeRepository = new PlantSpeciesTypeOrmWriteRepository(
      entityRepo,
      mapper,
    );
    readRepository = new PlantSpeciesTypeOrmReadRepository(entityRepo, mapper);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "plant_species" CASCADE');
  });

  it('persists an aggregate and reads it back by id', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const aggregate = buildAggregate(id, 'Rosa canina');

    await writeRepository.save(aggregate);

    const reloaded = await writeRepository.findById(id);
    expect(reloaded).not.toBeNull();
    expect(reloaded?.scientificName.value).toBe('Rosa canina');

    const viewModel = await readRepository.findById(id);
    expect(viewModel).not.toBeNull();
    expect(viewModel?.scientificName).toBe('Rosa canina');
  });

  it('returns null from findById when the species does not exist', async () => {
    const reloaded = await writeRepository.findById(
      '11111111-1111-1111-1111-111111111111',
    );
    expect(reloaded).toBeNull();
  });

  it('deletes a persisted aggregate', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440001';
    await writeRepository.save(buildAggregate(id, 'Mentha spicata'));

    await writeRepository.delete(id);

    expect(await writeRepository.findById(id)).toBeNull();
  });

  it('paginates results through findByCriteria', async () => {
    await writeRepository.save(
      buildAggregate('550e8400-e29b-41d4-a716-446655440002', 'Aloe vera'),
    );
    await writeRepository.save(
      buildAggregate('550e8400-e29b-41d4-a716-446655440003', 'Basil'),
    );

    const result = await readRepository.findByCriteria(
      new Criteria(undefined, undefined, undefined),
    );

    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(2);
  });
});
