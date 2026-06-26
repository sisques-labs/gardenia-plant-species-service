import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesImage } from '@contexts/plant-species/domain/interfaces/plant-species-image.interface';

export class PlantSpeciesImagesChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesImage[]>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesImage[]>,
  ) {
    super(metadata, data);
  }
}
