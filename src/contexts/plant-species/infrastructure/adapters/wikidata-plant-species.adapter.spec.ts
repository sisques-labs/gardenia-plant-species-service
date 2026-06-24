import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';

import { WikidataPlantSpeciesAdapter } from './wikidata-plant-species.adapter';

describe('WikidataPlantSpeciesAdapter', () => {
  let httpService: jest.Mocked<Pick<HttpService, 'get'>>;
  let adapter: WikidataPlantSpeciesAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    httpService = { get: jest.fn() };
    adapter = new WikidataPlantSpeciesAdapter(
      httpService as unknown as HttpService,
    );
  });

  it('returns null when no bindings are found', async () => {
    httpService.get.mockReturnValue(
      of({ data: { results: { bindings: [] } } }) as never,
    );

    const result = await adapter.fetchByScientificName('Not a plant');

    expect(result).toBeNull();
  });

  it('maps QID, Wikipedia, common names and external ids from bindings', async () => {
    httpService.get.mockReturnValue(
      of({
        data: {
          results: {
            bindings: [
              {
                item: {
                  type: 'uri',
                  value: 'http://www.wikidata.org/entity/Q159570',
                },
                image: {
                  type: 'uri',
                  value:
                    'http://commons.wikimedia.org/wiki/Special:FilePath/Monstera.jpg',
                },
                article: {
                  type: 'uri',
                  value: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
                },
                gbif: { type: 'literal', value: '2873000' },
                powo: { type: 'literal', value: '85211-1' },
                common: {
                  type: 'literal',
                  'xml:lang': 'es',
                  value: 'Costilla de Adán',
                },
              },
              {
                item: {
                  type: 'uri',
                  value: 'http://www.wikidata.org/entity/Q159570',
                },
                common: {
                  type: 'literal',
                  'xml:lang': 'en',
                  value: 'Swiss cheese plant',
                },
              },
            ],
          },
        },
      }) as never,
    );

    const result = await adapter.fetchByScientificName('Monstera deliciosa');

    expect(result).not.toBeNull();
    expect(result?.wikidataId).toBe('Q159570');
    expect(result?.wikipediaUrl).toBe(
      'https://en.wikipedia.org/wiki/Monstera_deliciosa',
    );
    expect(result?.commonNames).toEqual([
      {
        name: 'Costilla de Adán',
        language: 'es',
        source: PlantSpeciesSourceEnum.WIKIDATA,
      },
      {
        name: 'Swiss cheese plant',
        language: 'en',
        source: PlantSpeciesSourceEnum.WIKIDATA,
      },
    ]);
    expect(result?.images).toHaveLength(1);
    expect(result?.externalIds).toEqual(
      expect.arrayContaining([
        {
          scheme: PlantSpeciesExternalIdSchemeEnum.WIKIDATA,
          value: 'Q159570',
        },
        { scheme: PlantSpeciesExternalIdSchemeEnum.GBIF, value: '2873000' },
        { scheme: PlantSpeciesExternalIdSchemeEnum.POWO, value: '85211-1' },
      ]),
    );
  });

  it('returns null when the HTTP request fails', async () => {
    httpService.get.mockImplementation(() => {
      throw new Error('network');
    });

    const result = await adapter.fetchByScientificName('Monstera deliciosa');

    expect(result).toBeNull();
  });
});
