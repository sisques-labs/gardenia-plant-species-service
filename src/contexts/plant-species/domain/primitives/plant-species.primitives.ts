import { BasePrimitives } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-authorship.primitives';
import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-classification.primitives';
import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-common-name.primitives';
import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-external-id.primitives';
import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-image.primitives';

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
