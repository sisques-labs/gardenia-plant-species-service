import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import {
  IPlantSpeciesWikidataPort,
  PlantSpeciesWikidataRecord,
} from '@contexts/plant-species/application/ports/plant-species-wikidata.port';
import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';
import { PlantSpeciesCommonNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-common-name/plant-species-common-name.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';

import {
  WikidataSparqlBinding,
  WikidataSparqlResponse,
} from './wikidata/types/wikidata-api.types';

const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';
const REQUEST_TIMEOUT_MS = 8000;
const MAX_COMMON_NAMES = 20;

// Property map: P225 taxon name, P18 image, P846 GBIF id, P5037 POWO id,
// P961 IPNI id, P1772 USDA PLANTS id, P1843 taxon common name.
const SPARQL_TEMPLATE = (name: string): string => `
SELECT ?item ?image ?article ?gbif ?powo ?ipni ?usda ?common WHERE {
  ?item wdt:P225 "${name}" .
  OPTIONAL { ?item wdt:P18 ?image . }
  OPTIONAL { ?item wdt:P846 ?gbif . }
  OPTIONAL { ?item wdt:P5037 ?powo . }
  OPTIONAL { ?item wdt:P961 ?ipni . }
  OPTIONAL { ?item wdt:P1772 ?usda . }
  OPTIONAL { ?item wdt:P1843 ?common . }
  OPTIONAL {
    ?article schema:about ?item ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
}
LIMIT 50`;

@Injectable()
export class WikidataPlantSpeciesAdapter implements IPlantSpeciesWikidataPort {
  private readonly logger = new Logger(WikidataPlantSpeciesAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchByScientificName(
    scientificName: string,
  ): Promise<PlantSpeciesWikidataRecord | null> {
    const name = scientificName.trim();
    if (!name) return null;

    this.logger.log(`Querying Wikidata for "${name}"`);

    try {
      const bindings = await this.runQuery(name);
      if (bindings.length === 0) {
        this.logger.log(`No Wikidata taxon matched "${name}"`);
        return null;
      }

      const record = this.toRecord(bindings);
      this.logger.log(
        `Wikidata resolved "${name}" to ${record.wikidataId} (${record.commonNames.length} common names, ${record.externalIds.length} external ids)`,
      );
      return record;
    } catch (error) {
      this.logger.warn(`Wikidata lookup failed for "${name}": ${error}`);
      return null;
    }
  }

  private async runQuery(name: string): Promise<WikidataSparqlBinding[]> {
    // Escape characters that would break the SPARQL string literal.
    const safeName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    const { data } = await firstValueFrom(
      this.httpService.get<WikidataSparqlResponse>(WIKIDATA_SPARQL_URL, {
        params: { query: SPARQL_TEMPLATE(safeName), format: 'json' },
        headers: {
          Accept: 'application/sparql-results+json',
          'User-Agent':
            'gardenia-plant-species-service/1.0 (enrichment; +https://github.com/sisques-labs)',
        },
        timeout: REQUEST_TIMEOUT_MS,
      }),
    );

    return data.results?.bindings ?? [];
  }

  private toRecord(
    bindings: WikidataSparqlBinding[],
  ): PlantSpeciesWikidataRecord {
    const first = bindings[0];
    const wikidataId = this.extractQid(first.item?.value);

    return {
      wikidataId,
      wikipediaUrl: this.firstValue(bindings, 'article'),
      commonNames: this.extractCommonNames(bindings),
      images: this.extractImages(bindings),
      externalIds: this.extractExternalIds(bindings, wikidataId),
    };
  }

  private extractQid(itemUri: string | undefined): string {
    if (!itemUri) return '';
    const segments = itemUri.split('/');
    return segments[segments.length - 1] ?? '';
  }

  private firstValue(
    bindings: WikidataSparqlBinding[],
    field: string,
  ): string | null {
    for (const binding of bindings) {
      const value = binding[field]?.value?.trim();
      if (value) return value;
    }
    return null;
  }

  private extractCommonNames(
    bindings: WikidataSparqlBinding[],
  ): IPlantSpeciesCommonName[] {
    const seen = new Set<string>();
    const commonNames: IPlantSpeciesCommonName[] = [];

    for (const binding of bindings) {
      const cell = binding.common;
      const raw = cell?.value?.trim();
      if (!raw) continue;

      const name = raw.slice(
        0,
        PlantSpeciesCommonNameValueObject.MAX_NAME_LENGTH,
      );
      const language = cell['xml:lang']?.trim().toLowerCase() ?? null;
      const key = `${language ?? ''}::${name.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      commonNames.push({
        name,
        language,
        source: PlantSpeciesSourceEnum.WIKIDATA,
      });

      if (commonNames.length >= MAX_COMMON_NAMES) break;
    }

    return commonNames;
  }

  private extractImages(
    bindings: WikidataSparqlBinding[],
  ): IPlantSpeciesImage[] {
    const url = this.firstValue(bindings, 'image');
    if (!url || url.length > PlantSpeciesImageValueObject.MAX_URL_LENGTH) {
      return [];
    }
    return [
      {
        url,
        source: PlantSpeciesSourceEnum.WIKIDATA,
        isPrimary: false,
      },
    ];
  }

  private extractExternalIds(
    bindings: WikidataSparqlBinding[],
    wikidataId: string,
  ): IPlantSpeciesExternalId[] {
    const externalIds: IPlantSpeciesExternalId[] = [];

    if (wikidataId) {
      externalIds.push({
        scheme: PlantSpeciesExternalIdSchemeEnum.WIKIDATA,
        value: wikidataId,
      });
    }

    const mappings: Array<[string, PlantSpeciesExternalIdSchemeEnum]> = [
      ['gbif', PlantSpeciesExternalIdSchemeEnum.GBIF],
      ['powo', PlantSpeciesExternalIdSchemeEnum.POWO],
      ['ipni', PlantSpeciesExternalIdSchemeEnum.IPNI],
      ['usda', PlantSpeciesExternalIdSchemeEnum.USDA],
    ];

    for (const [field, scheme] of mappings) {
      const value = this.firstValue(bindings, field);
      if (value) {
        externalIds.push({
          scheme,
          value: value.slice(0, 255),
        });
      }
    }

    return externalIds;
  }
}
