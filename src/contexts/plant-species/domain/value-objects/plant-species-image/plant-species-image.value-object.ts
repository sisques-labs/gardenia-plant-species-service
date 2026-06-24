import { ValueObject } from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';

export class PlantSpeciesImageValueObject extends ValueObject<IPlantSpeciesImage> {
  static readonly MAX_URL_LENGTH = 500;

  private readonly _value: IPlantSpeciesImage;

  constructor(value: IPlantSpeciesImage) {
    super();
    this._value = {
      url: value.url.trim(),
      isPrimary: value.isPrimary,
    };
    this.validate();
  }

  get value(): IPlantSpeciesImage {
    return { ...this._value };
  }

  protected validate(): void {
    if (this._value.url.length === 0) {
      throw new Error('Plant species image URL must not be empty');
    }
    if (this._value.url.length > PlantSpeciesImageValueObject.MAX_URL_LENGTH) {
      throw new Error(
        `Plant species image URL exceeds ${PlantSpeciesImageValueObject.MAX_URL_LENGTH} characters`,
      );
    }
  }
}
