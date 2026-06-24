import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';

export interface IngestPlantSpeciesCommandInput {
  names: string[];
}

export class IngestPlantSpeciesCommand {
  public readonly names: PlantSpeciesScientificNameValueObject[];

  constructor(input: IngestPlantSpeciesCommandInput) {
    // Each name is validated/normalized by the value object (trimmed, non-empty,
    // length-bounded) before it ever reaches the queue.
    this.names = input.names.map(
      (name) => new PlantSpeciesScientificNameValueObject(name),
    );
  }
}
