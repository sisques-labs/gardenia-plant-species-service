import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesAuthorship } from '@contexts/plant-species/domain/interfaces/plant-species-authorship.interface';

export class PlantSpeciesAuthorshipChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesAuthorship | null>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesAuthorship | null>,
  ) {
    super(metadata, data);
  }
}
