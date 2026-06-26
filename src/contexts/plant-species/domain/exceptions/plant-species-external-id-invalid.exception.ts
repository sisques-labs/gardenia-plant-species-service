import { BaseException } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesExternalIdInvalidException extends BaseException {
  constructor(reason: string) {
    super(`Invalid plant species external id: ${reason}`);
  }
}
