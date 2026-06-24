import { BasePrimitives } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';
import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';

export type IPlantSpeciesPrimitives = BasePrimitives & {
  scientificName: string;
  description: string | null;
  /** Cover/primary image URL (also present in `images` with isPrimary=true). */
  imageUrl: string | null;
  classification: IPlantSpeciesClassification | null;
  authorship: IPlantSpeciesAuthorship | null;
  growthHabit: PlantSpeciesGrowthHabitEnum | null;
  wikipediaUrl: string | null;
  source: PlantSpeciesSourceEnum;
  lastEnrichedAt: Date | null;
  commonNames: IPlantSpeciesCommonName[];
  images: IPlantSpeciesImage[];
  externalIds: IPlantSpeciesExternalId[];
};
