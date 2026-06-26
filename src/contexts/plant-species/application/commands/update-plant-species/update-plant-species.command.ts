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
import { PlantSpeciesIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-id/plant-species-id.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';
import { PlantSpeciesImageUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image-url/plant-species-image-url.value-object';
import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';
import { PlantSpeciesWikipediaUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-wikipedia-url/plant-species-wikipedia-url.value-object';

export interface UpdatePlantSpeciesCommandInput {
  id: string;
  scientificName?: string;
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

export class UpdatePlantSpeciesCommand {
  public readonly id: PlantSpeciesIdValueObject;
  public readonly scientificName:
    | PlantSpeciesScientificNameValueObject
    | undefined;
  public readonly description:
    | PlantSpeciesDescriptionValueObject
    | null
    | undefined;
  public readonly imageUrl: PlantSpeciesImageUrlValueObject | null | undefined;
  public readonly classification:
    | PlantSpeciesClassificationValueObject
    | null
    | undefined;
  public readonly authorship:
    | PlantSpeciesAuthorshipValueObject
    | null
    | undefined;
  public readonly growthHabit:
    | PlantSpeciesGrowthHabitValueObject
    | null
    | undefined;
  public readonly wikipediaUrl:
    | PlantSpeciesWikipediaUrlValueObject
    | null
    | undefined;
  public readonly commonNames: PlantSpeciesCommonNameValueObject[] | undefined;
  public readonly images: PlantSpeciesImageValueObject[] | undefined;
  public readonly externalIds: PlantSpeciesExternalIdValueObject[] | undefined;

  constructor(input: UpdatePlantSpeciesCommandInput) {
    this.id = new PlantSpeciesIdValueObject(input.id);
    this.scientificName = input.scientificName
      ? new PlantSpeciesScientificNameValueObject(input.scientificName)
      : undefined;
    this.description =
      input.description !== undefined
        ? input.description != null
          ? new PlantSpeciesDescriptionValueObject(input.description)
          : null
        : undefined;
    this.imageUrl =
      input.imageUrl !== undefined
        ? input.imageUrl != null
          ? new PlantSpeciesImageUrlValueObject(input.imageUrl)
          : null
        : undefined;
    this.classification =
      input.classification !== undefined
        ? input.classification != null
          ? new PlantSpeciesClassificationValueObject(input.classification)
          : null
        : undefined;
    this.authorship =
      input.authorship !== undefined
        ? input.authorship != null
          ? new PlantSpeciesAuthorshipValueObject(input.authorship)
          : null
        : undefined;
    this.growthHabit =
      input.growthHabit !== undefined
        ? input.growthHabit != null
          ? new PlantSpeciesGrowthHabitValueObject(input.growthHabit)
          : null
        : undefined;
    this.wikipediaUrl =
      input.wikipediaUrl !== undefined
        ? input.wikipediaUrl != null
          ? new PlantSpeciesWikipediaUrlValueObject(input.wikipediaUrl)
          : null
        : undefined;
    this.commonNames =
      input.commonNames !== undefined
        ? input.commonNames.map(
            (name) => new PlantSpeciesCommonNameValueObject(name),
          )
        : undefined;
    this.images =
      input.images !== undefined
        ? input.images.map((image) => new PlantSpeciesImageValueObject(image))
        : undefined;
    this.externalIds =
      input.externalIds !== undefined
        ? input.externalIds.map(
            (externalId) => new PlantSpeciesExternalIdValueObject(externalId),
          )
        : undefined;
  }
}
