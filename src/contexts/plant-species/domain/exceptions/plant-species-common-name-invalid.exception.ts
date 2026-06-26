import { BaseException } from '@sisques-labs/nestjs-kit';

export class PlantSpeciesCommonNameInvalidException extends BaseException {
  constructor(reason: string) {
    super(`Invalid plant species common name: ${reason}`);
  }
}
