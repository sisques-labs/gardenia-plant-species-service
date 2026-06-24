import { Injectable } from '@nestjs/common';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';
import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { PlantSpeciesAggregate } from '@contexts/plant-species/domain/aggregates/plant-species.aggregate';
import { PlantSpeciesBuilder } from '@contexts/plant-species/domain/builders/plant-species.builder';
import { PlantSpeciesCommonNameTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-common-name.entity';
import { PlantSpeciesExternalIdTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-external-id.entity';
import { PlantSpeciesImageTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-image.entity';
import { PlantSpeciesTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species.entity';

@Injectable()
export class PlantSpeciesTypeOrmMapper {
  constructor(private readonly plantSpeciesBuilder: PlantSpeciesBuilder) {}

  public toDomain(entity: PlantSpeciesTypeOrmEntity): PlantSpeciesAggregate {
    return this.plantSpeciesBuilder
      .withId(entity.id)
      .withScientificName(entity.scientificName)
      .withDescription(entity.description ?? null)
      .withImageUrl(entity.imageUrl ?? null)
      .withClassification(this.toClassification(entity))
      .withAuthorship(this.toAuthorship(entity))
      .withGrowthHabit(
        (entity.growthHabit as PlantSpeciesGrowthHabitEnum | null) ?? null,
      )
      .withWikipediaUrl(entity.wikipediaUrl ?? null)
      .withSource(
        (entity.source as PlantSpeciesSourceEnum) ??
          PlantSpeciesSourceEnum.MANUAL,
      )
      .withLastEnrichedAt(entity.lastEnrichedAt ?? null)
      .withCommonNames(
        (entity.commonNames ?? []).map((commonName) => ({
          name: commonName.name,
          language: commonName.language ?? null,
          source: commonName.source as PlantSpeciesSourceEnum,
        })),
      )
      .withImages(
        (entity.images ?? []).map((image) => ({
          url: image.url,
          source: image.source as PlantSpeciesSourceEnum,
          isPrimary: image.isPrimary,
        })),
      )
      .withExternalIds(
        (entity.externalIds ?? []).map((externalId) => ({
          scheme: externalId.scheme as PlantSpeciesExternalIdSchemeEnum,
          value: externalId.value,
        })),
      )
      .withCreatedAt(entity.createdAt)
      .withUpdatedAt(entity.updatedAt)
      .build();
  }

  public toPersistence(
    plantSpecies: PlantSpeciesAggregate,
  ): PlantSpeciesTypeOrmEntity {
    const primitives = plantSpecies.toPrimitives();
    const entity = new PlantSpeciesTypeOrmEntity();

    entity.id = primitives.id;
    entity.scientificName = primitives.scientificName;
    entity.description = primitives.description;
    entity.imageUrl = primitives.imageUrl;

    entity.kingdom = primitives.classification?.kingdom ?? null;
    entity.phylum = primitives.classification?.phylum ?? null;
    entity.taxonClass = primitives.classification?.class ?? null;
    entity.taxonOrder = primitives.classification?.order ?? null;
    entity.family = primitives.classification?.family ?? null;
    entity.genus = primitives.classification?.genus ?? null;
    entity.specificEpithet = primitives.classification?.specificEpithet ?? null;
    entity.taxonRank = primitives.classification?.rank ?? null;

    entity.nameAuthorship = primitives.authorship?.author ?? null;
    entity.namePublishedInYear = primitives.authorship?.year ?? null;

    entity.growthHabit = primitives.growthHabit;
    entity.wikipediaUrl = primitives.wikipediaUrl;
    entity.source = primitives.source;
    entity.lastEnrichedAt = primitives.lastEnrichedAt;

    entity.commonNames = primitives.commonNames.map((commonName) => {
      const child = new PlantSpeciesCommonNameTypeOrmEntity();
      child.plantSpeciesId = primitives.id;
      child.name = commonName.name;
      child.language = commonName.language;
      child.source = commonName.source;
      return child;
    });

    entity.images = primitives.images.map((image) => {
      const child = new PlantSpeciesImageTypeOrmEntity();
      child.plantSpeciesId = primitives.id;
      child.url = image.url;
      child.source = image.source;
      child.isPrimary = image.isPrimary;
      return child;
    });

    entity.externalIds = primitives.externalIds.map((externalId) => {
      const child = new PlantSpeciesExternalIdTypeOrmEntity();
      child.plantSpeciesId = primitives.id;
      child.scheme = externalId.scheme;
      child.value = externalId.value;
      return child;
    });

    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;

    return entity;
  }

  private toClassification(
    entity: PlantSpeciesTypeOrmEntity,
  ): IPlantSpeciesClassification | null {
    const classification: IPlantSpeciesClassification = {
      kingdom: entity.kingdom ?? null,
      phylum: entity.phylum ?? null,
      class: entity.taxonClass ?? null,
      order: entity.taxonOrder ?? null,
      family: entity.family ?? null,
      genus: entity.genus ?? null,
      specificEpithet: entity.specificEpithet ?? null,
      rank: entity.taxonRank ?? null,
    };

    const hasAny = Object.values(classification).some((value) => value != null);
    return hasAny ? classification : null;
  }

  private toAuthorship(
    entity: PlantSpeciesTypeOrmEntity,
  ): IPlantSpeciesAuthorship | null {
    if (entity.nameAuthorship == null && entity.namePublishedInYear == null) {
      return null;
    }
    return {
      author: entity.nameAuthorship ?? null,
      year: entity.namePublishedInYear ?? null,
    };
  }
}
