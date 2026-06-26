import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesCommonName } from '@contexts/plant-species/domain/interfaces/plant-species-common-name.interface';

export class PlantSpeciesCommonNamesChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesCommonName[]>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesCommonName[]>,
  ) {
    super(metadata, data);
  }
}
