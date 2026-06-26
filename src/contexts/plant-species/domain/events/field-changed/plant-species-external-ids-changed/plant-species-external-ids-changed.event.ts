import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/primitives/plant-species-external-id.primitives';

export class PlantSpeciesExternalIdsChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesExternalIdPrimitives[]>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesExternalIdPrimitives[]>,
  ) {
    super(metadata, data);
  }
}
