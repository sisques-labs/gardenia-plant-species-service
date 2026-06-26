import {
  BooleanValueObject,
  StringValueObject,
} from '@sisques-labs/nestjs-kit';

/**
 * A single species image expressed as value objects. `isPrimary` flags the
 * preferred/cover image. See IPlantSpeciesImagePrimitives for the serialized form.
 */
export interface IPlantSpeciesImage {
  url: StringValueObject;
  isPrimary: BooleanValueObject;
}
