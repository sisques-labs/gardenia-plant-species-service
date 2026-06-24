import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';
import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';

export const PLANT_SPECIES_IMPORT_PORT = Symbol('PLANT_SPECIES_IMPORT_PORT');

/**
 * Normalized species data pulled from an external catalog (GBIF). Beyond the core
 * triple (scientificName/description/imageUrl) it carries the richer taxonomy and
 * collections an enrichment pass can persist. All extended fields are optional so
 * adapters may populate only what their source provides.
 */
export type PlantSpeciesImportRecord = {
  scientificName: string;
  description: string | null;
  imageUrl: string | null;
  classification?: IPlantSpeciesClassification | null;
  authorship?: IPlantSpeciesAuthorship | null;
  growthHabit?: PlantSpeciesGrowthHabitEnum | null;
  wikipediaUrl?: string | null;
  commonNames?: IPlantSpeciesCommonName[];
  images?: IPlantSpeciesImage[];
  externalIds?: IPlantSpeciesExternalId[];
};

export interface IPlantSpeciesImportPort {
  fetchPage(limit: number, offset: number): Promise<PlantSpeciesImportRecord[]>;

  /**
   * Resolves a single scientific name against the external catalog.
   * Returns null when the name does not match a known species or when no
   * enrichment data (description or image) is available.
   */
  fetchByScientificName(
    scientificName: string,
  ): Promise<PlantSpeciesImportRecord | null>;
}
