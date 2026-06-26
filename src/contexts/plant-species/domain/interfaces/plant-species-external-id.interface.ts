import { StringValueObject } from '@sisques-labs/nestjs-kit';

/**
 * Cross-reference of this species in an external catalog, expressed as value
 * objects. See IPlantSpeciesExternalIdPrimitives for the serialized form.
 */
export interface IPlantSpeciesExternalId {
  /** Catalog identifier, e.g. "GBIF", "WIKIDATA", "POWO". Free-form. */
  scheme: StringValueObject;
  value: StringValueObject;
}
