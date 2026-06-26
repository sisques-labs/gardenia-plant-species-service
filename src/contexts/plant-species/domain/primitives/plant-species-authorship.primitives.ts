/**
 * Primitive representation of nomenclatural authorship — used for serialization
 * (toPrimitives, events, persistence) and as the constructor input for
 * PlantSpeciesAuthorshipValueObject.
 */
export interface IPlantSpeciesAuthorshipPrimitives {
  author: string | null;
  year: number | null;
}
