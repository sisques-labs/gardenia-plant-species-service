import { ValueObject } from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';

export class PlantSpeciesAuthorshipValueObject extends ValueObject<IPlantSpeciesAuthorship> {
  static readonly MAX_AUTHOR_LENGTH = 255;
  static readonly MIN_YEAR = 1500;

  private readonly _value: IPlantSpeciesAuthorship;

  constructor(value: IPlantSpeciesAuthorship) {
    super();
    const author = value.author?.trim();
    this._value = {
      author: author != null && author.length > 0 ? author : null,
      year: value.year ?? null,
    };
    this.validate();
  }

  get value(): IPlantSpeciesAuthorship {
    return { ...this._value };
  }

  protected validate(): void {
    if (
      this._value.author != null &&
      this._value.author.length >
        PlantSpeciesAuthorshipValueObject.MAX_AUTHOR_LENGTH
    ) {
      throw new Error(
        `Plant species authorship author exceeds ${PlantSpeciesAuthorshipValueObject.MAX_AUTHOR_LENGTH} characters`,
      );
    }

    if (this._value.year != null) {
      const nextYear = new Date().getFullYear() + 1;
      if (
        !Number.isInteger(this._value.year) ||
        this._value.year < PlantSpeciesAuthorshipValueObject.MIN_YEAR ||
        this._value.year > nextYear
      ) {
        throw new Error(
          `Plant species authorship year must be an integer between ${PlantSpeciesAuthorshipValueObject.MIN_YEAR} and ${nextYear}`,
        );
      }
    }
  }
}
