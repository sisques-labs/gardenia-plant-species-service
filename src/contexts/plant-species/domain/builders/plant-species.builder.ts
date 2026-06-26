import { Injectable } from '@nestjs/common';
import {
  BaseBuilder,
  DateValueObject,
  FieldIsRequiredException,
} from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { IPlantSpeciesAuthorshipPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-authorship-primitives.interface';
import { IPlantSpeciesClassificationPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-classification-primitives.interface';
import { IPlantSpeciesCommonNamePrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-common-name-primitives.interface';
import { IPlantSpeciesExternalIdPrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-external-id-primitives.interface';
import { IPlantSpeciesImagePrimitives } from '@contexts/plant-species/domain/interfaces/plant-species-image-primitives.interface';
import { PlantSpeciesAggregate } from '@contexts/plant-species/domain/aggregates/plant-species.aggregate';
import { PlantSpeciesAuthorshipValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-authorship/plant-species-authorship.value-object';
import { PlantSpeciesClassificationValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-classification/plant-species-classification.value-object';
import { PlantSpeciesCommonNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-common-name/plant-species-common-name.value-object';
import { PlantSpeciesDescriptionValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-description/plant-species-description.value-object';
import { PlantSpeciesExternalIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-external-id/plant-species-external-id.value-object';
import { PlantSpeciesGrowthHabitValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-growth-habit/plant-species-growth-habit.value-object';
import { PlantSpeciesIdValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-id/plant-species-id.value-object';
import { PlantSpeciesImageValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image/plant-species-image.value-object';
import { PlantSpeciesImageUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-image-url/plant-species-image-url.value-object';
import { PlantSpeciesScientificNameValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-scientific-name/plant-species-scientific-name.value-object';
import { PlantSpeciesWikipediaUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-wikipedia-url/plant-species-wikipedia-url.value-object';
import { PlantSpeciesViewModel } from '@contexts/plant-species/domain/view-models/plant-species.view-model';

@Injectable()
export class PlantSpeciesBuilder extends BaseBuilder<
  PlantSpeciesAggregate,
  PlantSpeciesViewModel
> {
  private _scientificName!: string;
  private _description: string | null = null;
  private _imageUrl: string | null = null;
  private _classification: IPlantSpeciesClassificationPrimitives | null = null;
  private _authorship: IPlantSpeciesAuthorshipPrimitives | null = null;
  private _growthHabit: PlantSpeciesGrowthHabitEnum | null = null;
  private _wikipediaUrl: string | null = null;
  private _commonNames: IPlantSpeciesCommonNamePrimitives[] = [];
  private _images: IPlantSpeciesImagePrimitives[] = [];
  private _externalIds: IPlantSpeciesExternalIdPrimitives[] = [];

  withScientificName(scientificName: string): this {
    this._scientificName = scientificName;
    return this;
  }

  withDescription(description: string | null): this {
    this._description = description;
    return this;
  }

  withImageUrl(imageUrl: string | null): this {
    this._imageUrl = imageUrl;
    return this;
  }

  withClassification(
    classification: IPlantSpeciesClassificationPrimitives | null,
  ): this {
    this._classification = classification;
    return this;
  }

  withAuthorship(authorship: IPlantSpeciesAuthorshipPrimitives | null): this {
    this._authorship = authorship;
    return this;
  }

  withGrowthHabit(growthHabit: PlantSpeciesGrowthHabitEnum | null): this {
    this._growthHabit = growthHabit;
    return this;
  }

  withWikipediaUrl(wikipediaUrl: string | null): this {
    this._wikipediaUrl = wikipediaUrl;
    return this;
  }

  withCommonNames(commonNames: IPlantSpeciesCommonNamePrimitives[]): this {
    this._commonNames = commonNames;
    return this;
  }

  withImages(images: IPlantSpeciesImagePrimitives[]): this {
    this._images = images;
    return this;
  }

  withExternalIds(externalIds: IPlantSpeciesExternalIdPrimitives[]): this {
    this._externalIds = externalIds;
    return this;
  }

  public override build(): PlantSpeciesAggregate {
    this.validate();
    return new PlantSpeciesAggregate({
      id: new PlantSpeciesIdValueObject(this._id),
      scientificName: new PlantSpeciesScientificNameValueObject(
        this._scientificName,
      ),
      description:
        this._description != null
          ? new PlantSpeciesDescriptionValueObject(this._description)
          : null,
      imageUrl:
        this._imageUrl != null
          ? new PlantSpeciesImageUrlValueObject(this._imageUrl)
          : null,
      classification:
        this._classification != null
          ? new PlantSpeciesClassificationValueObject(this._classification)
          : null,
      authorship:
        this._authorship != null
          ? new PlantSpeciesAuthorshipValueObject(this._authorship)
          : null,
      growthHabit:
        this._growthHabit != null
          ? new PlantSpeciesGrowthHabitValueObject(this._growthHabit)
          : null,
      wikipediaUrl:
        this._wikipediaUrl != null
          ? new PlantSpeciesWikipediaUrlValueObject(this._wikipediaUrl)
          : null,
      commonNames: this._commonNames.map(
        (name) => new PlantSpeciesCommonNameValueObject(name),
      ),
      images: this._images.map(
        (image) => new PlantSpeciesImageValueObject(image),
      ),
      externalIds: this._externalIds.map(
        (externalId) => new PlantSpeciesExternalIdValueObject(externalId),
      ),
      createdAt: new DateValueObject(this._createdAt),
      updatedAt: new DateValueObject(this._updatedAt),
    });
  }

  public override buildViewModel(): PlantSpeciesViewModel {
    this.validate();
    return new PlantSpeciesViewModel({
      id: this._id,
      scientificName: this._scientificName,
      description: this._description,
      imageUrl: this._imageUrl,
      classification: this._classification,
      authorship: this._authorship,
      growthHabit: this._growthHabit,
      wikipediaUrl: this._wikipediaUrl,
      commonNames: this._commonNames,
      images: this._images,
      externalIds: this._externalIds,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    });
  }

  public override validate(): void {
    super.validate();
    if (!this._scientificName) {
      throw new FieldIsRequiredException('scientificName');
    }
  }
}
