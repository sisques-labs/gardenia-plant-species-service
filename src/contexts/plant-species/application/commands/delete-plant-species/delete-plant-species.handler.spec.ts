import { EventBus } from '@nestjs/cqrs';
import { DateValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesAggregate } from '@contexts/plant-species/domain/aggregates/plant-species.aggregate';
import { PlantSpeciesNotFoundException } from '@contexts/plant-species/domain/exceptions/plant-species-not-found.exception';
import { IPlantSpeciesWriteRepository } from '@contexts/plant-species/domain/repositories/write/plant-species-write.repository';
import { PlantSpeciesIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-id/plant-species-id.value-object';
import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';
import { AssertPlantSpeciesExistsService } from '@contexts/plant-species/application/services/write/assert-plant-species-exists/assert-plant-species-exists.service';

import { DeletePlantSpeciesCommand } from './delete-plant-species.command';
import { DeletePlantSpeciesCommandHandler } from './delete-plant-species.handler';

const PLANT_SPECIES_ID = '550e8400-e29b-41d4-a716-446655440000';
const NOW = new Date('2024-01-01');

const buildAggregate = (): PlantSpeciesAggregate =>
  new PlantSpeciesAggregate({
    id: new PlantSpeciesIdValueObject(PLANT_SPECIES_ID),
    scientificName: new PlantSpeciesScientificNameValueObject('Monstera'),
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

describe('DeletePlantSpeciesCommandHandler', () => {
  let handler: DeletePlantSpeciesCommandHandler;
  let writeRepository: jest.Mocked<IPlantSpeciesWriteRepository>;
  let assertExists: jest.Mocked<AssertPlantSpeciesExistsService>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    jest.clearAllMocks();

    writeRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      findByScientificName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IPlantSpeciesWriteRepository>;

    assertExists = {
      execute: jest.fn().mockResolvedValue(buildAggregate()),
    } as unknown as jest.Mocked<AssertPlantSpeciesExistsService>;

    eventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    handler = new DeletePlantSpeciesCommandHandler(
      writeRepository,
      assertExists,
      eventBus,
    );
  });

  it('deletes the species and publishes events', async () => {
    const command = new DeletePlantSpeciesCommand({ id: PLANT_SPECIES_ID });

    await handler.execute(command);

    expect(assertExists.execute).toHaveBeenCalledTimes(1);
    expect(writeRepository.delete).toHaveBeenCalledWith(PLANT_SPECIES_ID);
    expect(eventBus.publishAll).toHaveBeenCalledTimes(1);
  });

  it('throws PlantSpeciesNotFoundException and does not delete when species is missing', async () => {
    assertExists.execute.mockRejectedValue(
      new PlantSpeciesNotFoundException(PLANT_SPECIES_ID),
    );

    const command = new DeletePlantSpeciesCommand({ id: PLANT_SPECIES_ID });

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      PlantSpeciesNotFoundException,
    );
    expect(writeRepository.delete).not.toHaveBeenCalled();
    expect(eventBus.publishAll).not.toHaveBeenCalled();
  });
});
