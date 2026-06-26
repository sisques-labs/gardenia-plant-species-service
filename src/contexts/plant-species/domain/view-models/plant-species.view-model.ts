import { BaseViewModel } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-authorship.primitives';
import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-classification.primitives';
import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-common-name.primitives';
import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-external-id.primitives';
import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-image.primitives';
import { IPlantSpeciesPrimitives } from '@contexts/plant-species/domain/primitives/plant-species.primitives';

export class PlantSpeciesViewModel extends BaseViewModel {
  public readonly scientificName: string;
  public readonly description: string | null;
  public readonly imageUrl: string | null;
  public readonly classification: IPlantSpeciesClassificationPrimitives | null;
  public readonly authorship: IPlantSpeciesAuthorshipPrimitives | null;
  public readonly growthHabit: PlantSpeciesGrowthHabitEnum | null;
  public readonly wikipediaUrl: string | null;
  public readonly commonNames: IPlantSpeciesCommonNamePrimitives[];
  public readonly images: IPlantSpeciesImagePrimitives[];
  public readonly externalIds: IPlantSpeciesExternalIdPrimitives[];

  constructor(props: IPlantSpeciesPrimitives) {
    super(props.id, props.createdAt, props.updatedAt);
    this.scientificName = props.scientificName;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.classification = props.classification;
    this.authorship = props.authorship;
    this.growthHabit = props.growthHabit;
    this.wikipediaUrl = props.wikipediaUrl;
    this.commonNames = props.commonNames;
    this.images = props.images;
    this.externalIds = props.externalIds;
  }
}
