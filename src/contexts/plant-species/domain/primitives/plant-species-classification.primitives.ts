/**
 * Primitive representation of Linnaean classification — used for serialization
 * (toPrimitives, events, persistence) and as the constructor input for
 * PlantSpeciesClassificationValueObject.
 */
export interface IPlantSpeciesClassificationPrimitives {
  kingdom: string | null;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  genus: string | null;
  specificEpithet: string | null;
  rank: string | null;
}
