/** Cross-reference of this species in an external catalog. */
export interface IPlantSpeciesExternalId {
  /** Catalog identifier, e.g. "GBIF", "WIKIDATA", "POWO". Free-form. */
  scheme: string;
  value: string;
}
