import { BasePrimitives } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-authorship-primitives.interface';
import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-classification-primitives.interface';
import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-common-name-primitives.interface';
import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-external-id-primitives.interface';
import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-image-primitives.interface';

export type IPlantSpeciesPrimitives = BasePrimitives & {
  scientificName: string;
  description: string | null;
  /** Cover/primary image URL (also present in `images` with isPrimary=true). */
  imageUrl: string | null;
  classification: IPlantSpeciesClassificationPrimitives | null;
  authorship: IPlantSpeciesAuthorshipPrimitives | null;
  growthHabit: PlantSpeciesGrowthHabitEnum | null;
  wikipediaUrl: string | null;
  commonNames: IPlantSpeciesCommonNamePrimitives[];
  images: IPlantSpeciesImagePrimitives[];
  externalIds: IPlantSpeciesExternalIdPrimitives[];
};
