import {
  NumberValueObject,
  StringValueObject,
  ValueObject,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';
import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-authorship.primitives';

export class PlantSpeciesAuthorshipValueObject extends ValueObject<IPlantSpeciesAuthorshipPrimitives> {
  static readonly MAX_AUTHOR_LENGTH = 255;
  static readonly MIN_YEAR = 1500;

  private readonly _value: IPlantSpeciesAuthorship;

  constructor(value: IPlantSpeciesAuthorshipPrimitives) {
    super();
    const author = value.author?.trim();
    this._value = {
      author:
        author != null && author.length > 0
          ? new StringValueObject(author)
          : null,
      year: value.year != null ? new NumberValueObject(value.year) : null,
    };
    this.validate();
  }

  get value(): IPlantSpeciesAuthorshipPrimitives {
    return {
      author: this._value.author?.value ?? null,
      year: this._value.year?.value ?? null,
    };
  }

  protected validate(): void {
    const author = this._value.author?.value ?? null;
    if (
      author != null &&
      author.length > PlantSpeciesAuthorshipValueObject.MAX_AUTHOR_LENGTH
    ) {
      throw new Error(
        `Plant species authorship author exceeds ${PlantSpeciesAuthorshipValueObject.MAX_AUTHOR_LENGTH} characters`,
      );
    }

    const year = this._value.year?.value ?? null;
    if (year != null) {
      const nextYear = new Date().getFullYear() + 1;
      if (
        !Number.isInteger(year) ||
        year < PlantSpeciesAuthorshipValueObject.MIN_YEAR ||
        year > nextYear
      ) {
        throw new Error(
          `Plant species authorship year must be an integer between ${PlantSpeciesAuthorshipValueObject.MIN_YEAR} and ${nextYear}`,
        );
      }
    }
  }
}
