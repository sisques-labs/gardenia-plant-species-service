import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import {
  IPlantSpeciesImportPort,
  PlantSpeciesImportRecord,
} from '@contexts/plant-species/application/ports/plant-species-import.port';
import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';
import { PlantSpeciesCommonNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-common-name/plant-species-common-name.value-object';
import { PlantSpeciesDescriptionValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-description/plant-species-description.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';

import {
  GbifMediaResponse,
  GbifSpeciesMatchResponse,
  GbifSpeciesResponse,
  GbifSpeciesSearchResponse,
  GbifSpeciesSearchResult,
} from './gbif/types/gbif-api.types';

const GBIF_BASE_URL = 'https://api.gbif.org/v1';
const REQUEST_TIMEOUT_MS = 5000;
const VASCULAR_PLANTS_TAXON_KEY = 7707728;
const MAX_MEDIA = 5;
const MAX_COMMON_NAMES = 20;

@Injectable()
export class GbifPlantSpeciesImportAdapter implements IPlantSpeciesImportPort {
  private readonly logger = new Logger(GbifPlantSpeciesImportAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchByScientificName(
    scientificName: string,
  ): Promise<PlantSpeciesImportRecord | null> {
    try {
      const match = await this.getSpeciesMatch(scientificName);
      if (!match?.usageKey || match.matchType === 'NONE') {
        return null;
      }

      const resolvedName = (
        match.canonicalName ??
        match.scientificName ??
        scientificName
      ).trim();
      if (!resolvedName) {
        return null;
      }

      return this.enrichFromUsageKey(match.usageKey, resolvedName);
    } catch (error) {
      this.logger.warn(
        `GBIF enrichment lookup failed for "${scientificName}": ${error}`,
      );
      return null;
    }
  }

  async fetchPage(
    limit: number,
    offset: number,
  ): Promise<PlantSpeciesImportRecord[]> {
    try {
      const searchResults = await this.searchSpecies(limit, offset);
      const records = await Promise.all(
        searchResults.map((item) => this.toImportRecord(item)),
      );

      return records.filter(
        (record): record is PlantSpeciesImportRecord => record != null,
      );
    } catch (error) {
      this.logger.warn(`GBIF import page failed: ${error}`);
      return [];
    }
  }

  private async getSpeciesMatch(
    scientificName: string,
  ): Promise<GbifSpeciesMatchResponse | null> {
    const { data } = await firstValueFrom(
      this.httpService.get<GbifSpeciesMatchResponse>(
        `${GBIF_BASE_URL}/species/match`,
        {
          params: { name: scientificName },
          timeout: REQUEST_TIMEOUT_MS,
        },
      ),
    );

    return data;
  }

  private async searchSpecies(
    limit: number,
    offset: number,
  ): Promise<GbifSpeciesSearchResult[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<GbifSpeciesSearchResponse>(
        `${GBIF_BASE_URL}/species/search`,
        {
          params: {
            rank: 'SPECIES',
            status: 'ACCEPTED',
            highertaxon_key: VASCULAR_PLANTS_TAXON_KEY,
            limit,
            offset,
          },
          timeout: REQUEST_TIMEOUT_MS,
        },
      ),
    );

    return data.results ?? [];
  }

  private async toImportRecord(
    item: GbifSpeciesSearchResult,
  ): Promise<PlantSpeciesImportRecord | null> {
    const scientificName = (
      item.canonicalName ??
      item.scientificName ??
      ''
    ).trim();
    if (!scientificName || item.key == null) {
      return null;
    }

    try {
      return await this.enrichFromUsageKey(item.key, scientificName);
    } catch (error) {
      this.logger.warn(
        `GBIF enrichment failed for "${scientificName}": ${error}`,
      );
      return { scientificName, description: null, imageUrl: null };
    }
  }

  private async enrichFromUsageKey(
    usageKey: number,
    scientificName: string,
  ): Promise<PlantSpeciesImportRecord> {
    const [species, media] = await Promise.all([
      this.getSpecies(usageKey),
      this.getSpeciesMedia(usageKey),
    ]);

    const images = this.extractImages(media);
    const primaryImage = images.find((image) => image.isPrimary) ?? null;

    return {
      scientificName,
      description: this.extractDescription(species),
      imageUrl: primaryImage?.url ?? null,
      classification: this.extractClassification(species),
      authorship: species.authorship
        ? { author: species.authorship, year: null }
        : null,
      commonNames: this.extractCommonNames(species),
      images,
      externalIds: [
        {
          scheme: PlantSpeciesExternalIdSchemeEnum.GBIF,
          value: String(usageKey),
        },
      ],
    };
  }

  private async getSpecies(usageKey: number): Promise<GbifSpeciesResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<GbifSpeciesResponse>(
        `${GBIF_BASE_URL}/species/${usageKey}`,
        { timeout: REQUEST_TIMEOUT_MS },
      ),
    );

    return data;
  }

  private async getSpeciesMedia(
    usageKey: number,
  ): Promise<GbifMediaResponse | null> {
    const { data } = await firstValueFrom(
      this.httpService.get<GbifMediaResponse>(
        `${GBIF_BASE_URL}/species/${usageKey}/media`,
        {
          params: { limit: MAX_MEDIA },
          timeout: REQUEST_TIMEOUT_MS,
        },
      ),
    );

    return data;
  }

  private extractDescription(species: GbifSpeciesResponse): string | null {
    const englishDescription = species.descriptions?.find(
      (entry) =>
        entry.language?.toLowerCase().startsWith('en') && entry.description,
    )?.description;

    if (englishDescription) {
      return this.truncate(
        englishDescription,
        PlantSpeciesDescriptionValueObject.MAX_LENGTH,
      );
    }

    const englishVernacular = species.vernacularNames?.find(
      (entry) =>
        entry.language?.toLowerCase().startsWith('en') && entry.vernacularName,
    )?.vernacularName;

    return englishVernacular
      ? this.truncate(
          englishVernacular,
          PlantSpeciesDescriptionValueObject.MAX_LENGTH,
        )
      : null;
  }

  private extractClassification(
    species: GbifSpeciesResponse,
  ): IPlantSpeciesClassification | null {
    const classification: IPlantSpeciesClassification = {
      kingdom: species.kingdom ?? null,
      phylum: species.phylum ?? null,
      class: species.class ?? null,
      order: species.order ?? null,
      family: species.family ?? null,
      genus: species.genus ?? null,
      specificEpithet: species.species ?? null,
      rank: species.rank ?? null,
    };

    const hasAny = Object.values(classification).some((value) => value != null);
    return hasAny ? classification : null;
  }

  private extractCommonNames(
    species: GbifSpeciesResponse,
  ): IPlantSpeciesCommonName[] {
    const seen = new Set<string>();
    const commonNames: IPlantSpeciesCommonName[] = [];

    for (const entry of species.vernacularNames ?? []) {
      const raw = entry.vernacularName?.trim();
      if (!raw) continue;

      const name = this.truncate(
        raw,
        PlantSpeciesCommonNameValueObject.MAX_NAME_LENGTH,
      );
      const language = entry.language?.trim().toLowerCase() ?? null;
      const key = `${language ?? ''}::${name.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      commonNames.push({
        name,
        language,
        source: PlantSpeciesSourceEnum.GBIF,
      });

      if (commonNames.length >= MAX_COMMON_NAMES) break;
    }

    return commonNames;
  }

  private extractImages(media: GbifMediaResponse | null): IPlantSpeciesImage[] {
    const seen = new Set<string>();
    const images: IPlantSpeciesImage[] = [];

    for (const result of media?.results ?? []) {
      const identifier = result.identifier?.trim();
      if (!identifier) continue;
      if (identifier.length > PlantSpeciesImageValueObject.MAX_URL_LENGTH) {
        continue;
      }
      if (seen.has(identifier)) continue;
      seen.add(identifier);

      images.push({
        url: identifier,
        source: PlantSpeciesSourceEnum.GBIF,
        isPrimary: images.length === 0,
      });
    }

    return images;
  }

  private truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? value.slice(0, maxLength) : value;
  }
}
