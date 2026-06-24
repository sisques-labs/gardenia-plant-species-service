import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';

/** Cross-reference of this species in an external catalog (GBIF, Wikidata, …). */
export interface IPlantSpeciesExternalId {
  scheme: PlantSpeciesExternalIdSchemeEnum;
  value: string;
}
