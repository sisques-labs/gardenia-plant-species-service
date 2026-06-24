import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';

export const PLANT_SPECIES_WIKIDATA_PORT = Symbol(
  'PLANT_SPECIES_WIKIDATA_PORT',
);

/**
 * Encyclopedic data resolved from Wikidata for a scientific name. All fields are
 * best-effort: Wikidata coverage is uneven, so any of them may be empty/null.
 */
export type PlantSpeciesWikidataRecord = {
  /** Wikidata entity id (QID), e.g. "Q157892". */
  wikidataId: string;
  wikipediaUrl: string | null;
  commonNames: IPlantSpeciesCommonName[];
  images: IPlantSpeciesImage[];
  externalIds: IPlantSpeciesExternalId[];
};

export interface IPlantSpeciesWikidataPort {
  /**
   * Resolves a single scientific name against Wikidata. Returns null when the name
   * does not match a Wikidata taxon item or the lookup fails.
   */
  fetchByScientificName(
    scientificName: string,
  ): Promise<PlantSpeciesWikidataRecord | null>;
}
