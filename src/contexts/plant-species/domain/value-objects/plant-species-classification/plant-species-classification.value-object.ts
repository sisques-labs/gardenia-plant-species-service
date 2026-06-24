import { ValueObject } from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';

export class PlantSpeciesClassificationValueObject extends ValueObject<IPlantSpeciesClassification> {
  static readonly MAX_LENGTH = 255;

  private readonly _value: IPlantSpeciesClassification;

  constructor(value: IPlantSpeciesClassification) {
    super();
    this._value = {
      kingdom: PlantSpeciesClassificationValueObject.normalize(value.kingdom),
      phylum: PlantSpeciesClassificationValueObject.normalize(value.phylum),
      class: PlantSpeciesClassificationValueObject.normalize(value.class),
      order: PlantSpeciesClassificationValueObject.normalize(value.order),
      family: PlantSpeciesClassificationValueObject.normalize(value.family),
      genus: PlantSpeciesClassificationValueObject.normalize(value.genus),
      specificEpithet: PlantSpeciesClassificationValueObject.normalize(
        value.specificEpithet,
      ),
      rank: PlantSpeciesClassificationValueObject.normalize(value.rank),
    };
    this.validate();
  }

  get value(): IPlantSpeciesClassification {
    return { ...this._value };
  }

  private static normalize(value: string | null): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }

  protected validate(): void {
    for (const [field, value] of Object.entries(this._value)) {
      if (
        value != null &&
        value.length > PlantSpeciesClassificationValueObject.MAX_LENGTH
      ) {
        throw new Error(
          `Plant species classification field "${field}" exceeds ${PlantSpeciesClassificationValueObject.MAX_LENGTH} characters`,
        );
      }
    }
  }
}
