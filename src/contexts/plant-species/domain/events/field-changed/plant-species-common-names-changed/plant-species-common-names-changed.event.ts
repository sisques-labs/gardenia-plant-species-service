import {
  BaseEvent,
  IEventMetadata,
  IFieldChangedEventData,
} from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/primitives/plant-species-common-name.primitives';

export class PlantSpeciesCommonNamesChangedEvent extends BaseEvent<
  IFieldChangedEventData<IPlantSpeciesCommonNamePrimitives[]>
> {
  constructor(
    metadata: IEventMetadata,
    data: IFieldChangedEventData<IPlantSpeciesCommonNamePrimitives[]>,
  ) {
    super(metadata, data);
  }
}
