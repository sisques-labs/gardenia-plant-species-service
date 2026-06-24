import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler, UuidValueObject } from '@sisques-labs/nestjs-kit';

import {
  IPlantSpeciesImportPort,
  PLANT_SPECIES_IMPORT_PORT,
  PlantSpeciesImportRecord,
} from '@contexts/plant-species/application/ports/plant-species-import.port';
import {
  IPlantSpeciesWikidataPort,
  PLANT_SPECIES_WIKIDATA_PORT,
  PlantSpeciesWikidataRecord,
} from '@contexts/plant-species/application/ports/plant-species-wikidata.port';
import {
  PlantSpeciesAggregate,
  PlantSpeciesEnrichmentProps,
} from '@contexts/plant-species/domain/aggregates/plant-species.aggregate';
import { PlantSpeciesBuilder } from '@contexts/plant-species/domain/builders/plant-species.builder';
import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';
import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';
import {
  IPlantSpeciesWriteRepository,
  PLANT_SPECIES_WRITE_REPOSITORY,
} from '@contexts/plant-species/domain/repositories/write/plant-species-write.repository';
import { PlantSpeciesAuthorshipValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-authorship/plant-species-authorship.value-object';
import { PlantSpeciesClassificationValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-classification/plant-species-classification.value-object';
import { PlantSpeciesCommonNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-common-name/plant-species-common-name.value-object';
import { PlantSpeciesDescriptionValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-description/plant-species-description.value-object';
import { PlantSpeciesExternalIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-external-id/plant-species-external-id.value-object';
import { PlantSpeciesGrowthHabitValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-growth-habit/plant-species-growth-habit.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';
import { PlantSpeciesImageUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image-url/plant-species-image-url.value-object';
import { PlantSpeciesSourceValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-source/plant-species-source.value-object';
import { PlantSpeciesWikipediaUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-wikipedia-url/plant-species-wikipedia-url.value-object';

import { EnrichPlantSpeciesCommand } from './enrich-plant-species.command';

/** Combined, de-duplicated enrichment from all sources, as primitives. */
type MergedEnrichment = {
  scientificName: string;
  description: string | null;
  imageUrl: string | null;
  classification: IPlantSpeciesClassification | null;
  authorship: IPlantSpeciesAuthorship | null;
  growthHabit: PlantSpeciesGrowthHabitEnum | null;
  wikipediaUrl: string | null;
  commonNames: IPlantSpeciesCommonName[];
  images: IPlantSpeciesImage[];
  externalIds: IPlantSpeciesExternalId[];
  source: PlantSpeciesSourceEnum;
};

@CommandHandler(EnrichPlantSpeciesCommand)
export class EnrichPlantSpeciesCommandHandler
  extends BaseCommandHandler<EnrichPlantSpeciesCommand, PlantSpeciesAggregate>
  implements ICommandHandler<EnrichPlantSpeciesCommand, string | null>
{
  private readonly logger = new Logger(EnrichPlantSpeciesCommandHandler.name);

  constructor(
    @Inject(PLANT_SPECIES_IMPORT_PORT)
    private readonly importPort: IPlantSpeciesImportPort,
    @Inject(PLANT_SPECIES_WIKIDATA_PORT)
    private readonly wikidataPort: IPlantSpeciesWikidataPort,
    @Inject(PLANT_SPECIES_WRITE_REPOSITORY)
    private readonly plantSpeciesWriteRepository: IPlantSpeciesWriteRepository,
    private readonly plantSpeciesBuilder: PlantSpeciesBuilder,
    eventBus: EventBus,
  ) {
    super(eventBus);
  }

  async execute(command: EnrichPlantSpeciesCommand): Promise<string | null> {
    const scientificName = command.scientificName.value;

    const [gbif, wikidata] = await Promise.all([
      this.importPort.fetchByScientificName(scientificName),
      this.wikidataPort.fetchByScientificName(scientificName),
    ]);

    if (!gbif && !wikidata) {
      this.logger.log(
        `No enrichment data for scientific name: ${scientificName}`,
      );
      return null;
    }

    const merged = this.merge(scientificName, gbif, wikidata);

    const existing =
      await this.plantSpeciesWriteRepository.findByScientificName(
        merged.scientificName.toLowerCase(),
      );

    if (existing) {
      existing.enrich(this.toEnrichmentProps(merged));
      await this.plantSpeciesWriteRepository.save(existing);
      await this.publishEvents(existing);

      this.logger.log(`Plant species enriched: ${existing.id.value}`);
      return existing.id.value;
    }

    const now = new Date();
    const aggregate = this.plantSpeciesBuilder
      .withId(UuidValueObject.generate().value)
      .withScientificName(merged.scientificName)
      .withDescription(merged.description)
      .withImageUrl(merged.imageUrl)
      .withClassification(merged.classification)
      .withAuthorship(merged.authorship)
      .withGrowthHabit(merged.growthHabit)
      .withWikipediaUrl(merged.wikipediaUrl)
      .withSource(merged.source)
      .withLastEnrichedAt(now)
      .withCommonNames(merged.commonNames)
      .withImages(merged.images)
      .withExternalIds(merged.externalIds)
      .withCreatedAt(now)
      .withUpdatedAt(now)
      .build();
    aggregate.create();

    await this.plantSpeciesWriteRepository.save(aggregate);
    await this.publishEvents(aggregate);

    this.logger.log(
      `Plant species created from enrichment: ${aggregate.id.value}`,
    );
    return aggregate.id.value;
  }

  private merge(
    requestedName: string,
    gbif: PlantSpeciesImportRecord | null,
    wikidata: PlantSpeciesWikidataRecord | null,
  ): MergedEnrichment {
    const images = this.dedupeImages([
      ...(gbif?.images ?? []),
      ...(wikidata?.images ?? []),
    ]);
    const primaryImage = images.find((image) => image.isPrimary) ?? null;

    return {
      scientificName: gbif?.scientificName ?? requestedName,
      description: gbif?.description ?? null,
      imageUrl: primaryImage?.url ?? gbif?.imageUrl ?? null,
      classification: gbif?.classification ?? null,
      authorship: gbif?.authorship ?? null,
      growthHabit: gbif?.growthHabit ?? null,
      wikipediaUrl: wikidata?.wikipediaUrl ?? gbif?.wikipediaUrl ?? null,
      commonNames: this.dedupeCommonNames([
        ...(gbif?.commonNames ?? []),
        ...(wikidata?.commonNames ?? []),
      ]),
      images,
      externalIds: this.dedupeExternalIds([
        ...(gbif?.externalIds ?? []),
        ...(wikidata?.externalIds ?? []),
      ]),
      source: wikidata
        ? PlantSpeciesSourceEnum.WIKIDATA
        : PlantSpeciesSourceEnum.GBIF,
    };
  }

  private dedupeCommonNames(
    names: IPlantSpeciesCommonName[],
  ): IPlantSpeciesCommonName[] {
    const seen = new Set<string>();
    const result: IPlantSpeciesCommonName[] = [];
    for (const name of names) {
      const key = `${name.language ?? ''}::${name.name.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(name);
    }
    return result;
  }

  private dedupeImages(images: IPlantSpeciesImage[]): IPlantSpeciesImage[] {
    const seen = new Set<string>();
    const result: IPlantSpeciesImage[] = [];
    for (const image of images) {
      if (seen.has(image.url)) continue;
      seen.add(image.url);
      // Exactly one primary: the first unique image wins.
      result.push({ ...image, isPrimary: result.length === 0 });
    }
    return result;
  }

  private dedupeExternalIds(
    externalIds: IPlantSpeciesExternalId[],
  ): IPlantSpeciesExternalId[] {
    const byScheme = new Map<string, IPlantSpeciesExternalId>();
    for (const externalId of externalIds) {
      if (!byScheme.has(externalId.scheme)) {
        byScheme.set(externalId.scheme, externalId);
      }
    }
    return [...byScheme.values()];
  }

  private toEnrichmentProps(
    merged: MergedEnrichment,
  ): PlantSpeciesEnrichmentProps {
    return {
      description:
        merged.description != null
          ? new PlantSpeciesDescriptionValueObject(merged.description)
          : null,
      imageUrl:
        merged.imageUrl != null
          ? new PlantSpeciesImageUrlValueObject(merged.imageUrl)
          : null,
      classification:
        merged.classification != null
          ? new PlantSpeciesClassificationValueObject(merged.classification)
          : null,
      authorship:
        merged.authorship != null
          ? new PlantSpeciesAuthorshipValueObject(merged.authorship)
          : null,
      growthHabit:
        merged.growthHabit != null
          ? new PlantSpeciesGrowthHabitValueObject(merged.growthHabit)
          : null,
      wikipediaUrl:
        merged.wikipediaUrl != null
          ? new PlantSpeciesWikipediaUrlValueObject(merged.wikipediaUrl)
          : null,
      commonNames: merged.commonNames.map(
        (name) => new PlantSpeciesCommonNameValueObject(name),
      ),
      images: merged.images.map(
        (image) => new PlantSpeciesImageValueObject(image),
      ),
      externalIds: merged.externalIds.map(
        (externalId) => new PlantSpeciesExternalIdValueObject(externalId),
      ),
      source: new PlantSpeciesSourceValueObject(merged.source),
    };
  }
}
