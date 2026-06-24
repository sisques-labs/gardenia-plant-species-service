import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';

/** A single image of a species. `isPrimary` flags the preferred/cover image. */
export interface IPlantSpeciesImage {
  url: string;
  source: PlantSpeciesSourceEnum;
  isPrimary: boolean;
}
