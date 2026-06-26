import { StringValueObject, ValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesCommonNameInvalidException } from '@contexts/plant-species/domain/exceptions/plant-species-common-name-invalid.exception';
import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';
import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-common-name.primitives';

export class PlantSpeciesCommonNameValueObject extends ValueObject<IPlantSpeciesCommonNamePrimitives> {
  static readonly MAX_NAME_LENGTH = 255;
  static readonly MAX_LANGUAGE_LENGTH = 16;

  private readonly _value: IPlantSpeciesCommonName;

  constructor(value: IPlantSpeciesCommonNamePrimitives) {
    super();
    const language = value.language?.trim();
    this._value = {
      name: new StringValueObject(value.name.trim()),
      language:
        language != null && language.length > 0
          ? new StringValueObject(language)
          : null,
    };
    this.validate();
  }

  get value(): IPlantSpeciesCommonNamePrimitives {
    return {
      name: this._value.name.value,
      language: this._value.language?.value ?? null,
    };
  }

  protected validate(): void {
    const name = this._value.name.value;
    if (name.length === 0) {
      throw new PlantSpeciesCommonNameInvalidException(
        'name must not be empty',
      );
    }
    if (name.length > PlantSpeciesCommonNameValueObject.MAX_NAME_LENGTH) {
      throw new PlantSpeciesCommonNameInvalidException(
        `name exceeds ${PlantSpeciesCommonNameValueObject.MAX_NAME_LENGTH} characters`,
      );
    }
    const language = this._value.language?.value ?? null;
    if (
      language != null &&
      language.length > PlantSpeciesCommonNameValueObject.MAX_LANGUAGE_LENGTH
    ) {
      throw new PlantSpeciesCommonNameInvalidException(
        `language exceeds ${PlantSpeciesCommonNameValueObject.MAX_LANGUAGE_LENGTH} characters`,
      );
    }
  }
}
