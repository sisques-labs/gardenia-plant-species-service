import { StringValueObject, ValueObject } from '@sisques-labs/nestjs-kit';

import { IPlantSpeciesClassification } from '@contexts/plant-species/domain/interfaces/plant-species-classification.interface';
import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-classification-primitives.interface';

export class PlantSpeciesClassificationValueObject extends ValueObject<IPlantSpeciesClassificationPrimitives> {
  static readonly MAX_LENGTH = 255;

  private readonly _value: IPlantSpeciesClassification;

  constructor(value: IPlantSpeciesClassificationPrimitives) {
    super();
    this._value = {
      kingdom: PlantSpeciesClassificationValueObject.wrap(value.kingdom),
      phylum: PlantSpeciesClassificationValueObject.wrap(value.phylum),
      class: PlantSpeciesClassificationValueObject.wrap(value.class),
      order: PlantSpeciesClassificationValueObject.wrap(value.order),
      family: PlantSpeciesClassificationValueObject.wrap(value.family),
      genus: PlantSpeciesClassificationValueObject.wrap(value.genus),
      specificEpithet: PlantSpeciesClassificationValueObject.wrap(
        value.specificEpithet,
      ),
      rank: PlantSpeciesClassificationValueObject.wrap(value.rank),
    };
    this.validate();
  }

  get value(): IPlantSpeciesClassificationPrimitives {
    return {
      kingdom: this._value.kingdom?.value ?? null,
      phylum: this._value.phylum?.value ?? null,
      class: this._value.class?.value ?? null,
      order: this._value.order?.value ?? null,
      family: this._value.family?.value ?? null,
      genus: this._value.genus?.value ?? null,
      specificEpithet: this._value.specificEpithet?.value ?? null,
      rank: this._value.rank?.value ?? null,
    };
  }

  private static wrap(raw: string | null): StringValueObject | null {
    if (raw == null) return null;
    const trimmed = raw.trim();
    return trimmed.length === 0 ? null : new StringValueObject(trimmed);
  }

  protected validate(): void {
    for (const [field, vo] of Object.entries(this._value)) {
      const v = vo?.value ?? null;
      if (
        v != null &&
        v.length > PlantSpeciesClassificationValueObject.MAX_LENGTH
      ) {
        throw new Error(
          `Plant species classification field "${field}" exceeds ${PlantSpeciesClassificationValueObject.MAX_LENGTH} characters`,
        );
      }
    }
  }
}
