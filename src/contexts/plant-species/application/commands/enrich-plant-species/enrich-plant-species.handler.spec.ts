import { EventBus } from '@nestjs/cqrs';

import { IPlantSpeciesImportPort } from '@contexts/plant-species/application/ports/plant-species-import.port';
import { IPlantSpeciesWikidataPort } from '@contexts/plant-species/application/ports/plant-species-wikidata.port';
import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { PlantSpeciesBuilder } from '@contexts/plant-species/domain/builders/plant-species.builder';
import { IPlantSpeciesWriteRepository } from '@contexts/plant-species/domain/repositories/write/plant-species-write.repository';

import { EnrichPlantSpeciesCommand } from './enrich-plant-species.command';
import { EnrichPlantSpeciesCommandHandler } from './enrich-plant-species.handler';

const NOW = new Date('2024-01-01');

describe('EnrichPlantSpeciesCommandHandler', () => {
  let handler: EnrichPlantSpeciesCommandHandler;
  let importPort: jest.Mocked<IPlantSpeciesImportPort>;
  let wikidataPort: jest.Mocked<IPlantSpeciesWikidataPort>;
  let writeRepository: jest.Mocked<IPlantSpeciesWriteRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    jest.clearAllMocks();

    importPort = {
      fetchPage: jest.fn(),
      fetchByScientificName: jest.fn(),
    };

    wikidataPort = {
      fetchByScientificName: jest.fn().mockResolvedValue(null),
    };

    writeRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      findByScientificName: jest.fn(),
      save: jest
        .fn()
        .mockImplementation((aggregate) => Promise.resolve(aggregate)),
      delete: jest.fn(),
    } as jest.Mocked<IPlantSpeciesWriteRepository>;

    eventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    handler = new EnrichPlantSpeciesCommandHandler(
      importPort,
      wikidataPort,
      writeRepository,
      new PlantSpeciesBuilder(),
      eventBus,
    );
  });

  it('returns null when neither source finds enrichment data', async () => {
    importPort.fetchByScientificName.mockResolvedValue(null);
    wikidataPort.fetchByScientificName.mockResolvedValue(null);

    const result = await handler.execute(
      new EnrichPlantSpeciesCommand({ scientificName: 'mesa' }),
    );

    expect(result).toBeNull();
    expect(writeRepository.save).not.toHaveBeenCalled();
  });

  it('enriches existing species merging GBIF and Wikidata data', async () => {
    const existing = new PlantSpeciesBuilder()
      .withId('550e8400-e29b-41d4-a716-446655440000')
      .withScientificName('Monstera deliciosa')
      .withCreatedAt(NOW)
      .withUpdatedAt(NOW)
      .build();

    importPort.fetchByScientificName.mockResolvedValue({
      scientificName: 'Monstera deliciosa',
      description: 'Tropical plant',
      imageUrl: 'https://example.com/img.jpg',
      classification: {
        kingdom: 'Plantae',
        phylum: null,
        class: null,
        order: null,
        family: 'Araceae',
        genus: 'Monstera',
        specificEpithet: 'deliciosa',
        rank: 'SPECIES',
      },
      commonNames: [
        {
          name: 'Swiss cheese plant',
          language: 'en',
          source: PlantSpeciesSourceEnum.GBIF,
        },
      ],
      images: [
        {
          url: 'https://example.com/img.jpg',
          source: PlantSpeciesSourceEnum.GBIF,
          isPrimary: true,
        },
      ],
      externalIds: [
        { scheme: PlantSpeciesExternalIdSchemeEnum.GBIF, value: '2873000' },
      ],
    });
    wikidataPort.fetchByScientificName.mockResolvedValue({
      wikidataId: 'Q159570',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
      commonNames: [
        {
          name: 'Costilla de Adán',
          language: 'es',
          source: PlantSpeciesSourceEnum.WIKIDATA,
        },
      ],
      images: [],
      externalIds: [
        { scheme: PlantSpeciesExternalIdSchemeEnum.WIKIDATA, value: 'Q159570' },
      ],
    });
    writeRepository.findByScientificName.mockResolvedValue(existing);

    const result = await handler.execute(
      new EnrichPlantSpeciesCommand({ scientificName: 'Monstera deliciosa' }),
    );

    expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(writeRepository.save).toHaveBeenCalledTimes(1);

    const primitives = existing.toPrimitives();
    expect(primitives.description).toBe('Tropical plant');
    expect(primitives.classification?.family).toBe('Araceae');
    expect(primitives.commonNames).toHaveLength(2);
    expect(primitives.externalIds.map((e) => e.scheme)).toEqual(
      expect.arrayContaining([
        PlantSpeciesExternalIdSchemeEnum.GBIF,
        PlantSpeciesExternalIdSchemeEnum.WIKIDATA,
      ]),
    );
    expect(primitives.wikipediaUrl).toBe(
      'https://en.wikipedia.org/wiki/Monstera_deliciosa',
    );
    expect(primitives.source).toBe(PlantSpeciesSourceEnum.WIKIDATA);
    expect(eventBus.publishAll).toHaveBeenCalledTimes(1);
  });

  it('creates a new species from enrichment when not in database', async () => {
    importPort.fetchByScientificName.mockResolvedValue({
      scientificName: 'Ocimum basilicum',
      description: 'Basil',
      imageUrl: null,
    });
    wikidataPort.fetchByScientificName.mockResolvedValue(null);
    writeRepository.findByScientificName.mockResolvedValue(null);

    const result = await handler.execute(
      new EnrichPlantSpeciesCommand({ scientificName: 'Ocimum basilicum' }),
    );

    expect(result).toEqual(expect.any(String));
    expect(writeRepository.save).toHaveBeenCalledTimes(1);
    expect(writeRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        scientificName: expect.objectContaining({ value: 'Ocimum basilicum' }),
      }),
    );
    expect(eventBus.publishAll).toHaveBeenCalledTimes(1);
  });

  it('uses canonical scientific name from GBIF when creating', async () => {
    importPort.fetchByScientificName.mockResolvedValue({
      scientificName: 'Monstera deliciosa',
      description: 'Desc',
      imageUrl: null,
    });
    wikidataPort.fetchByScientificName.mockResolvedValue(null);
    writeRepository.findByScientificName.mockResolvedValue(null);

    await handler.execute(
      new EnrichPlantSpeciesCommand({ scientificName: 'monstera deliciosa' }),
    );

    expect(writeRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        scientificName: expect.objectContaining({
          value: 'Monstera deliciosa',
        }),
      }),
    );
  });
});
