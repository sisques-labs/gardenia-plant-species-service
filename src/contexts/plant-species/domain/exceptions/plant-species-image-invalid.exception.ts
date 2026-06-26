import { BaseException } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesImageInvalidException extends BaseException {
  constructor(reason: string) {
    super(`Invalid plant species image: ${reason}`);
  }
}
