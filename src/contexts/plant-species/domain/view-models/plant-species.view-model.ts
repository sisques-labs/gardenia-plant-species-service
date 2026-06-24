import { BaseViewModel } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';
import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';
import { IPlantSpeciesPrimitives } from '@contexts/plant-species/domain/primitives/plant-species.primitives';

export class PlantSpeciesViewModel extends BaseViewModel {
  public readonly scientificName: string;
  public readonly description: string | null;
  public readonly imageUrl: string | null;
  public readonly classification: IPlantSpeciesClassification | null;
  public readonly authorship: IPlantSpeciesAuthorship | null;
  public readonly growthHabit: PlantSpeciesGrowthHabitEnum | null;
  public readonly wikipediaUrl: string | null;
  public readonly commonNames: IPlantSpeciesCommonName[];
  public readonly images: IPlantSpeciesImage[];
  public readonly externalIds: IPlantSpeciesExternalId[];

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
