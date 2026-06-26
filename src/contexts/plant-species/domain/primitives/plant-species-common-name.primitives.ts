/**
 * Primitive representation of a vernacular name — used for serialization
 * (toPrimitives, events, persistence) and as the constructor input for
 * PlantSpeciesCommonNameValueObject.
 */
export interface IPlantSpeciesCommonNamePrimitives {
  name: string;
  /** BCP-47 / ISO-639 language code, or null when unknown. */
  language: string | null;
}
