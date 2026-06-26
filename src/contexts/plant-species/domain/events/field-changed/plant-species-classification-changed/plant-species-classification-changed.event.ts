import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-classification-primitives.interface';

export class PlantSpeciesClassificationChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesClassificationPrimitives | null>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesClassificationPrimitives | null>,
  ) {
    super(metadata, data);
  }
}
