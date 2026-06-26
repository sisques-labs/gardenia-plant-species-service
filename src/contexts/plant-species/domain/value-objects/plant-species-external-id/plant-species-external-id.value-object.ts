import { StringValueObject, ValueObject } from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';
import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-external-id.primitives';

export class PlantSpeciesExternalIdValueObject extends ValueObject<IPlantSpeciesExternalIdPrimitives> {
  static readonly MAX_SCHEME_LENGTH = 32;
  static readonly MAX_VALUE_LENGTH = 255;

  private readonly _value: IPlantSpeciesExternalId;

  constructor(value: IPlantSpeciesExternalIdPrimitives) {
    super();
    this._value = {
      scheme: new StringValueObject(value.scheme.trim()),
      value: new StringValueObject(value.value.trim()),
    };
    this.validate();
  }

  get value(): IPlantSpeciesExternalIdPrimitives {
    return {
      scheme: this._value.scheme.value,
      value: this._value.value.value,
    };
  }

  protected validate(): void {
    const scheme = this._value.scheme.value;
    if (scheme.length === 0) {
      throw new Error('Plant species external id scheme must not be empty');
    }
    if (scheme.length > PlantSpeciesExternalIdValueObject.MAX_SCHEME_LENGTH) {
      throw new Error(
        `Plant species external id scheme exceeds ${PlantSpeciesExternalIdValueObject.MAX_SCHEME_LENGTH} characters`,
      );
    }
    const value = this._value.value.value;
    if (value.length === 0) {
      throw new Error('Plant species external id value must not be empty');
    }
    if (value.length > PlantSpeciesExternalIdValueObject.MAX_VALUE_LENGTH) {
      throw new Error(
        `Plant species external id value exceeds ${PlantSpeciesExternalIdValueObject.MAX_VALUE_LENGTH} characters`,
      );
    }
  }
}
