import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';

/** A vernacular (common) name in a given language, plus where it came from. */
export interface IPlantSpeciesCommonName {
  name: string;
  /** BCP-47 / ISO-639 language code (e.g. "en", "es"), or null when unknown. */
  language: string | null;
  source: PlantSpeciesSourceEnum;
}
