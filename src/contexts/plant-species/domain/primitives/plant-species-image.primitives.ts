/**
 * Primitive representation of a species image — used for serialization
 * (toPrimitives, events, persistence) and as the constructor input for
 * PlantSpeciesImageValueObject.
 */
export interface IPlantSpeciesImagePrimitives {
  url: string;
  isPrimary: boolean;
}
