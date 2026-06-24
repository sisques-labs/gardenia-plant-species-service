import { EnumValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';

export class PlantSpeciesSourceValueObject extends EnumValueObject<
  typeof PlantSpeciesSourceEnum
> {
  protected get enumObject(): typeof PlantSpeciesSourceEnum {
    return PlantSpeciesSourceEnum;
  }
}
