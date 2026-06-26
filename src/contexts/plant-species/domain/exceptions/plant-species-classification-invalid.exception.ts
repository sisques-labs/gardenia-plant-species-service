import { BaseException } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesClassificationInvalidException extends BaseException {
  constructor(reason: string) {
    super(`Invalid plant species classification: ${reason}`);
  }
}
