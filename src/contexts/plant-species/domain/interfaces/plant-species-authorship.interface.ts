import { NumberValueObject, StringValueObject } from '@sisques-labs/nestjs-kit';

/**
 * Nomenclatural authorship of a species name expressed as value objects.
 * See IPlantSpeciesAuthorshipPrimitives for the serialized (primitive) form.
 */
export interface IPlantSpeciesAuthorship {
  author: StringValueObject | null;
  year: NumberValueObject | null;
}
