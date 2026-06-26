import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-classification.primitives';

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
