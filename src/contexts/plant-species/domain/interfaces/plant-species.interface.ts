import { DateValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesAuthorshipValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-authorship/plant-species-authorship.value-object';
import { PlantSpeciesClassificationValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-classification/plant-species-classification.value-object';
import { PlantSpeciesCommonNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-common-name/plant-species-common-name.value-object';
import { PlantSpeciesDescriptionValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-description/plant-species-description.value-object';
import { PlantSpeciesExternalIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-external-id/plant-species-external-id.value-object';
import { PlantSpeciesGrowthHabitValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-growth-habit/plant-species-growth-habit.value-object';
import { PlantSpeciesIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-id/plant-species-id.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';
import { PlantSpeciesImageUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image-url/plant-species-image-url.value-object';
import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';
import { PlantSpeciesSourceValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-source/plant-species-source.value-object';
import { PlantSpeciesWikipediaUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-wikipedia-url/plant-species-wikipedia-url.value-object';

export interface IPlantSpecies {
  id: PlantSpeciesIdValueObject;
  scientificName: PlantSpeciesScientificNameValueObject;
  description: PlantSpeciesDescriptionValueObject | null;
  imageUrl: PlantSpeciesImageUrlValueObject | null;
  classification: PlantSpeciesClassificationValueObject | null;
  authorship: PlantSpeciesAuthorshipValueObject | null;
  growthHabit: PlantSpeciesGrowthHabitValueObject | null;
  wikipediaUrl: PlantSpeciesWikipediaUrlValueObject | null;
  source: PlantSpeciesSourceValueObject;
  lastEnrichedAt: DateValueObject | null;
  commonNames: PlantSpeciesCommonNameValueObject[];
  images: PlantSpeciesImageValueObject[];
  externalIds: PlantSpeciesExternalIdValueObject[];
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}
