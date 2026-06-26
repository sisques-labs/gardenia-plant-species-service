import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-external-id-primitives.interface';

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
