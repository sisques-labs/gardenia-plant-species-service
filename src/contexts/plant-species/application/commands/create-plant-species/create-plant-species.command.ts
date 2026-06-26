import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-authorship.primitives';
import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-classification.primitives';
import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-common-name.primitives';
import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-external-id.primitives';
import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-image.primitives';
import { PlantSpeciesAuthorshipValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-authorship/plant-species-authorship.value-object';
import { PlantSpeciesClassificationValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-classification/plant-species-classification.value-object';
import { PlantSpeciesCommonNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-common-name/plant-species-common-name.value-object';
import { PlantSpeciesDescriptionValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-description/plant-species-description.value-object';
import { PlantSpeciesExternalIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-external-id/plant-species-external-id.value-object';
import { PlantSpeciesGrowthHabitValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-growth-habit/plant-species-growth-habit.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';
import { PlantSpeciesImageUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image-url/plant-species-image-url.value-object';
import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';
import { PlantSpeciesWikipediaUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-wikipedia-url/plant-species-wikipedia-url.value-object';

export interface CreatePlantSpeciesCommandInput {
  scientificName: string;
  description?: string | null;
  imageUrl?: string | null;
  classification?: IPlantSpeciesClassificationPrimitives | null;
  authorship?: IPlantSpeciesAuthorshipPrimitives | null;
  growthHabit?: PlantSpeciesGrowthHabitEnum | null;
  wikipediaUrl?: string | null;
  commonNames?: IPlantSpeciesCommonNamePrimitives[];
  images?: IPlantSpeciesImagePrimitives[];
  externalIds?: IPlantSpeciesExternalIdPrimitives[];
}

export class CreatePlantSpeciesCommand {
  public readonly scientificName: PlantSpeciesScientificNameValueObject;
  public readonly description: PlantSpeciesDescriptionValueObject | null;
  public readonly imageUrl: PlantSpeciesImageUrlValueObject | null;
  public readonly classification: PlantSpeciesClassificationValueObject | null;
  public readonly authorship: PlantSpeciesAuthorshipValueObject | null;
  public readonly growthHabit: PlantSpeciesGrowthHabitValueObject | null;
  public readonly wikipediaUrl: PlantSpeciesWikipediaUrlValueObject | null;
  public readonly commonNames: PlantSpeciesCommonNameValueObject[];
  public readonly images: PlantSpeciesImageValueObject[];
  public readonly externalIds: PlantSpeciesExternalIdValueObject[];

  constructor(input: CreatePlantSpeciesCommandInput) {
    this.scientificName = new PlantSpeciesScientificNameValueObject(
      input.scientificName,
    );
    this.description =
      input.description != null
        ? new PlantSpeciesDescriptionValueObject(input.description)
        : null;
    this.imageUrl =
      input.imageUrl != null
        ? new PlantSpeciesImageUrlValueObject(input.imageUrl)
        : null;
    this.classification =
      input.classification != null
        ? new PlantSpeciesClassificationValueObject(input.classification)
        : null;
    this.authorship =
      input.authorship != null
        ? new PlantSpeciesAuthorshipValueObject(input.authorship)
        : null;
    this.growthHabit =
      input.growthHabit != null
        ? new PlantSpeciesGrowthHabitValueObject(input.growthHabit)
        : null;
    this.wikipediaUrl =
      input.wikipediaUrl != null
        ? new PlantSpeciesWikipediaUrlValueObject(input.wikipediaUrl)
        : null;
    this.commonNames = (input.commonNames ?? []).map(
      (name) => new PlantSpeciesCommonNameValueObject(name),
    );
    this.images = (input.images ?? []).map(
      (image) => new PlantSpeciesImageValueObject(image),
    );
    this.externalIds = (input.externalIds ?? []).map(
      (externalId) => new PlantSpeciesExternalIdValueObject(externalId),
    );
  }
}
