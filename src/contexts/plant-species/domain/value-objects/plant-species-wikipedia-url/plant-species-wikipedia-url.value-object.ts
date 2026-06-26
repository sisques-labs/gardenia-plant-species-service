import { UrlValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesWikipediaUrlInvalidException } from '@contexts/plant-species/domain/exceptions/plant-species-wikipedia-url-invalid.exception';

export class PlantSpeciesWikipediaUrlValueObject extends UrlValueObject {
  static readonly MAX_LENGTH = 500;

  constructor(value: string) {
    super(value.trim());
    if (this.value.length > PlantSpeciesWikipediaUrlValueObject.MAX_LENGTH) {
      throw new PlantSpeciesWikipediaUrlInvalidException(
        `exceeds ${PlantSpeciesWikipediaUrlValueObject.MAX_LENGTH} characters`,
      );
    }
  }
}
