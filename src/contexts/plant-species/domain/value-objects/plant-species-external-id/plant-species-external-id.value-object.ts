import { ValueObject } from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';

export class PlantSpeciesExternalIdValueObject extends ValueObject<IPlantSpeciesExternalId> {
  static readonly MAX_SCHEME_LENGTH = 32;
  static readonly MAX_VALUE_LENGTH = 255;

  private readonly _value: IPlantSpeciesExternalId;

  constructor(value: IPlantSpeciesExternalId) {
    super();
    this._value = {
      scheme: value.scheme.trim(),
      value: value.value.trim(),
    };
    this.validate();
  }

  get value(): IPlantSpeciesExternalId {
    return { ...this._value };
  }

  protected validate(): void {
    if (this._value.scheme.length === 0) {
      throw new Error('Plant species external id scheme must not be empty');
    }
    if (
      this._value.scheme.length >
      PlantSpeciesExternalIdValueObject.MAX_SCHEME_LENGTH
    ) {
      throw new Error(
        `Plant species external id scheme exceeds ${PlantSpeciesExternalIdValueObject.MAX_SCHEME_LENGTH} characters`,
      );
    }
    if (this._value.value.length === 0) {
      throw new Error('Plant species external id value must not be empty');
    }
    if (
      this._value.value.length >
      PlantSpeciesExternalIdValueObject.MAX_VALUE_LENGTH
    ) {
      throw new Error(
        `Plant species external id value exceeds ${PlantSpeciesExternalIdValueObject.MAX_VALUE_LENGTH} characters`,
      );
    }
  }
}
