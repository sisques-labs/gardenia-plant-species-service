import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';

export class PlantSpeciesClassificationChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesClassification | null>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesClassification | null>,
  ) {
    super(metadata, data);
  }
}
