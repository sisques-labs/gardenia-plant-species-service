import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-image-primitives.interface';

export class PlantSpeciesImagesChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesImagePrimitives[]>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesImagePrimitives[]>,
  ) {
    super(metadata, data);
  }
}
