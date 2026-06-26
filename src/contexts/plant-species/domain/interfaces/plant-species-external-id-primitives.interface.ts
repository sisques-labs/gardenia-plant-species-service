/**
 * Primitive representation of an external catalog cross-reference — used for
 * serialization (toPrimitives, events, persistence) and as the constructor
 * input for PlantSpeciesExternalIdValueObject.
 */
export interface IPlantSpeciesExternalIdPrimitives {
  /** Catalog identifier, e.g. "GBIF", "WIKIDATA", "POWO". Free-form. */
  scheme: string;
  value: string;
}
