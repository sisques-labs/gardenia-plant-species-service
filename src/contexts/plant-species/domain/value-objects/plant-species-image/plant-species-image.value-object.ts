import {
  BooleanValueObject,
  StringValueObject,
  ValueObject,
} from '@sisques-labs/nestjs-kit';

import { PlantSpeciesImageInvalidException } from '@contexts/plant-species/domain/exceptions/plant-species-image-invalid.exception';
import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';
import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-image.primitives';

export class PlantSpeciesImageValueObject extends ValueObject<IPlantSpeciesImagePrimitives> {
  static readonly MAX_URL_LENGTH = 500;

  private readonly _value: IPlantSpeciesImage;

  constructor(value: IPlantSpeciesImagePrimitives) {
    super();
    this._value = {
      url: new StringValueObject(value.url.trim()),
      isPrimary: new BooleanValueObject(value.isPrimary),
    };
    this.validate();
  }

  get value(): IPlantSpeciesImagePrimitives {
    return {
      url: this._value.url.value,
      isPrimary: this._value.isPrimary.value,
    };
  }

  protected validate(): void {
    const url = this._value.url.value;
    if (url.length === 0) {
      throw new PlantSpeciesImageInvalidException('url must not be empty');
    }
    if (url.length > PlantSpeciesImageValueObject.MAX_URL_LENGTH) {
      throw new PlantSpeciesImageInvalidException(
        `url exceeds ${PlantSpeciesImageValueObject.MAX_URL_LENGTH} characters`,
      );
    }
  }
}
