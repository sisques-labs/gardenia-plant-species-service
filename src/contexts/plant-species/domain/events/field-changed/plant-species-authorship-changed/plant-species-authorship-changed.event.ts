import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-authorship.primitives';

export class PlantSpeciesAuthorshipChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesAuthorshipPrimitives | null>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesAuthorshipPrimitives | null>,
  ) {
    super(metadata, data);
  }
}
