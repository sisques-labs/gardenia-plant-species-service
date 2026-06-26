import { BaseException } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesAuthorshipInvalidException extends BaseException {
  constructor(reason: string) {
    super(`Invalid plant species authorship: ${reason}`);
  }
}
