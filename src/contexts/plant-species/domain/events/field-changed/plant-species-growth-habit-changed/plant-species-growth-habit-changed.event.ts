import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';

export class PlantSpeciesGrowthHabitChangedEvent extends BaseEvent<
  IFieldChangedEventData<PlantSpeciesGrowthHabitEnum | null>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<PlantSpeciesGrowthHabitEnum | null>,
  ) {
    super(metadata, data);
  }
}
