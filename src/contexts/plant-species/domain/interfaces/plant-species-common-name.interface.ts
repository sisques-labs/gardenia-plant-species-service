import { StringValueObject } from '@sisques-labs/nestjs-kit';

/**
 * Vernacular (common) name in a given language expressed as value objects.
 * See IPlantSpeciesCommonNamePrimitives for the serialized (primitive) form.
 */
export interface IPlantSpeciesCommonName {
  name: StringValueObject;
  /** BCP-47 / ISO-639 language code, or null when unknown. */
  language: StringValueObject | null;
}
