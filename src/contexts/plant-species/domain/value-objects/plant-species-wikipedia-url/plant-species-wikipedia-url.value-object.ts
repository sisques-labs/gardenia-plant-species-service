import { UrlValueObject } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesWikipediaUrlValueObject extends UrlValueObject {
  static readonly MAX_LENGTH = 500;

  constructor(value: string) {
    super(value.trim());
    if (this.value.length > PlantSpeciesWikipediaUrlValueObject.MAX_LENGTH) {
      throw new Error(
        `Plant species Wikipedia URL exceeds ${PlantSpeciesWikipediaUrlValueObject.MAX_LENGTH} characters`,
      );
    }
  }
}
