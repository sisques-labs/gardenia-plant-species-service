import { BaseException } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesWikipediaUrlInvalidException extends BaseException {
  constructor(reason: string) {
    super(`Invalid plant species Wikipedia URL: ${reason}`);
  }
}
