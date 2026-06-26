import { StringValueObject } from '@sisques-labs/nestjs-kit';

/**
 * Linnaean classification expressed as value objects. Every rank is optional.
 * See IPlantSpeciesClassificationPrimitives for the serialized (primitive) form.
 */
export interface IPlantSpeciesClassification {
  kingdom: StringValueObject | null;
  phylum: StringValueObject | null;
  class: StringValueObject | null;
  order: StringValueObject | null;
  family: StringValueObject | null;
  genus: StringValueObject | null;
  specificEpithet: StringValueObject | null;
  rank: StringValueObject | null;
}
