import { ValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';

export class PlantSpeciesCommonNameValueObject extends ValueObject<IPlantSpeciesCommonName> {
  static readonly MAX_NAME_LENGTH = 255;
  static readonly MAX_LANGUAGE_LENGTH = 16;

  private readonly _value: IPlantSpeciesCommonName;

  constructor(value: IPlantSpeciesCommonName) {
    super();
    const language = value.language?.trim();
    this._value = {
      name: value.name.trim(),
      language: language != null && language.length > 0 ? language : null,
      source: value.source,
    };
    this.validate();
  }

  get value(): IPlantSpeciesCommonName {
    return { ...this._value };
  }

  protected validate(): void {
    if (this._value.name.length === 0) {
      throw new Error('Plant species common name must not be empty');
    }
    if (
      this._value.name.length >
      PlantSpeciesCommonNameValueObject.MAX_NAME_LENGTH
    ) {
      throw new Error(
        `Plant species common name exceeds ${PlantSpeciesCommonNameValueObject.MAX_NAME_LENGTH} characters`,
      );
    }
    if (
      this._value.language != null &&
      this._value.language.length >
        PlantSpeciesCommonNameValueObject.MAX_LANGUAGE_LENGTH
    ) {
      throw new Error(
        `Plant species common name language exceeds ${PlantSpeciesCommonNameValueObject.MAX_LANGUAGE_LENGTH} characters`,
      );
    }
    if (!Object.values(PlantSpeciesSourceEnum).includes(this._value.source)) {
      throw new Error(
        `Invalid plant species common name source: ${this._value.source}`,
      );
    }
  }
}
