import { EnumValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';

export class PlantSpeciesGrowthHabitValueObject extends EnumValueObject<
  typeof PlantSpeciesGrowthHabitEnum
> {
  protected get enumObject(): typeof PlantSpeciesGrowthHabitEnum {
    return PlantSpeciesGrowthHabitEnum;
  }
}
