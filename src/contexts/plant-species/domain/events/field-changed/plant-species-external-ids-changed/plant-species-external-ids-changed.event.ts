import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesExternalId } from '@contexts/plant-species/domain/interfaces/plant-species-external-id.interface';

export class PlantSpeciesExternalIdsChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesExternalId[]>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesExternalId[]>,
  ) {
    super(metadata, data);
  }
}
