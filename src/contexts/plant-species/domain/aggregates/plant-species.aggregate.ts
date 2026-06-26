import { BaseAggregate } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesAuthorshipChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-authorship-changed/plant-species-authorship-changed.event';
import { PlantSpeciesClassificationChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-classification-changed/plant-species-classification-changed.event';
import { PlantSpeciesCommonNamesChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-common-names-changed/plant-species-common-names-changed.event';
import { PlantSpeciesDescriptionChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-description-changed/plant-species-description-changed.event';
import { PlantSpeciesExternalIdsChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-external-ids-changed/plant-species-external-ids-changed.event';
import { PlantSpeciesGrowthHabitChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-growth-habit-changed/plant-species-growth-habit-changed.event';
import { PlantSpeciesImageUrlChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-image-url-changed/plant-species-image-url-changed.event';
import { PlantSpeciesImagesChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-images-changed/plant-species-images-changed.event';
import { PlantSpeciesScientificNameChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-scientific-name-changed/plant-species-scientific-name-changed.event';
import { PlantSpeciesWikipediaUrlChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-wikipedia-url-changed/plant-species-wikipedia-url-changed.event';
import { PlantSpeciesCreatedEvent } from '@contexts/plant-species/domain/events/plant-species-created/plant-species-created.event';
import { PlantSpeciesDeletedEvent } from '@contexts/plant-species/domain/events/plant-species-deleted/plant-species-deleted.event';
import { PlantSpeciesUpdatedEvent } from '@contexts/plant-species/domain/events/plant-species-updated/plant-species-updated.event';
import { IPlantSpecies } from '@contexts/plant-species/domain/interfaces/plant-species.interface';
import { IPlantSpeciesPrimitives } from '@contexts/plant-species/domain/primitives/plant-species.primitives';
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

export class PlantSpeciesAggregate extends BaseAggregate {
  private readonly _id: PlantSpeciesIdValueObject;
  private _scientificName: PlantSpeciesScientificNameValueObject;
  private _description: PlantSpeciesDescriptionValueObject | null;
  private _imageUrl: PlantSpeciesImageUrlValueObject | null;
  private _classification: PlantSpeciesClassificationValueObject | null;
  private _authorship: PlantSpeciesAuthorshipValueObject | null;
  private _growthHabit: PlantSpeciesGrowthHabitValueObject | null;
  private _wikipediaUrl: PlantSpeciesWikipediaUrlValueObject | null;
  private _commonNames: PlantSpeciesCommonNameValueObject[];
  private _images: PlantSpeciesImageValueObject[];
  private _externalIds: PlantSpeciesExternalIdValueObject[];

  constructor(props: IPlantSpecies) {
    super(props.createdAt, props.updatedAt);
    this._id = props.id;
    this._scientificName = props.scientificName;
    this._description = props.description;
    this._imageUrl = props.imageUrl;
    this._classification = props.classification;
    this._authorship = props.authorship;
    this._growthHabit = props.growthHabit;
    this._wikipediaUrl = props.wikipediaUrl;
    this._commonNames = props.commonNames;
    this._images = props.images;
    this._externalIds = props.externalIds;
  }

  public create(): void {
    this.apply(
      new PlantSpeciesCreatedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesCreatedEvent.name,
        },
        this.toPrimitives(),
      ),
    );
  }

  public update(props: {
    scientificName?: PlantSpeciesScientificNameValueObject;
    description?: PlantSpeciesDescriptionValueObject | null;
    imageUrl?: PlantSpeciesImageUrlValueObject | null;
    classification?: PlantSpeciesClassificationValueObject | null;
    authorship?: PlantSpeciesAuthorshipValueObject | null;
    growthHabit?: PlantSpeciesGrowthHabitValueObject | null;
    wikipediaUrl?: PlantSpeciesWikipediaUrlValueObject | null;
    commonNames?: PlantSpeciesCommonNameValueObject[];
    images?: PlantSpeciesImageValueObject[];
    externalIds?: PlantSpeciesExternalIdValueObject[];
  }): void {
    if (props.scientificName !== undefined) {
      this.changeScientificName(props.scientificName);
    }

    if (props.description !== undefined) {
      this.changeDescription(props.description);
    }

    if (props.imageUrl !== undefined) {
      this.changeImageUrl(props.imageUrl);
    }

    if (props.classification !== undefined) {
      this.changeClassification(props.classification);
    }

    if (props.authorship !== undefined) {
      this.changeAuthorship(props.authorship);
    }

    if (props.growthHabit !== undefined) {
      this.changeGrowthHabit(props.growthHabit);
    }

    if (props.wikipediaUrl !== undefined) {
      this.changeWikipediaUrl(props.wikipediaUrl);
    }

    if (props.commonNames !== undefined) {
      this.changeCommonNames(props.commonNames);
    }

    if (props.images !== undefined) {
      this.changeImages(props.images);
    }

    if (props.externalIds !== undefined) {
      this.changeExternalIds(props.externalIds);
    }

    this.apply(
      new PlantSpeciesUpdatedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesUpdatedEvent.name,
        },
        this.toPrimitives(),
      ),
    );
  }

  private changeScientificName(
    newScientificName: PlantSpeciesScientificNameValueObject,
  ): void {
    const oldValue = this._scientificName.value;
    const newValue = newScientificName.value;

    if (oldValue === newValue) return;

    this._scientificName = newScientificName;
    this.touch();

    this.apply(
      new PlantSpeciesScientificNameChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesScientificNameChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeDescription(
    newDescription: PlantSpeciesDescriptionValueObject | null,
  ): void {
    const oldValue = this._description?.value ?? null;
    const newValue = newDescription?.value ?? null;

    if (oldValue === newValue) return;

    this._description = newDescription;
    this.touch();

    this.apply(
      new PlantSpeciesDescriptionChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesDescriptionChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeImageUrl(
    newImageUrl: PlantSpeciesImageUrlValueObject | null,
  ): void {
    const oldValue = this._imageUrl?.value ?? null;
    const newValue = newImageUrl?.value ?? null;

    if (oldValue === newValue) return;

    this._imageUrl = newImageUrl;
    this.touch();

    this.apply(
      new PlantSpeciesImageUrlChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesImageUrlChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeClassification(
    newClassification: PlantSpeciesClassificationValueObject | null,
  ): void {
    const oldValue = this._classification?.value ?? null;
    const newValue = newClassification?.value ?? null;

    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;

    this._classification = newClassification;
    this.touch();

    this.apply(
      new PlantSpeciesClassificationChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesClassificationChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeAuthorship(
    newAuthorship: PlantSpeciesAuthorshipValueObject | null,
  ): void {
    const oldValue = this._authorship?.value ?? null;
    const newValue = newAuthorship?.value ?? null;

    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;

    this._authorship = newAuthorship;
    this.touch();

    this.apply(
      new PlantSpeciesAuthorshipChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesAuthorshipChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeGrowthHabit(
    newGrowthHabit: PlantSpeciesGrowthHabitValueObject | null,
  ): void {
    const oldValue =
      (this._growthHabit?.value as PlantSpeciesGrowthHabitEnum) ?? null;
    const newValue =
      (newGrowthHabit?.value as PlantSpeciesGrowthHabitEnum) ?? null;

    if (oldValue === newValue) return;

    this._growthHabit = newGrowthHabit;
    this.touch();

    this.apply(
      new PlantSpeciesGrowthHabitChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesGrowthHabitChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeWikipediaUrl(
    newWikipediaUrl: PlantSpeciesWikipediaUrlValueObject | null,
  ): void {
    const oldValue = this._wikipediaUrl?.value ?? null;
    const newValue = newWikipediaUrl?.value ?? null;

    if (oldValue === newValue) return;

    this._wikipediaUrl = newWikipediaUrl;
    this.touch();

    this.apply(
      new PlantSpeciesWikipediaUrlChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesWikipediaUrlChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeCommonNames(
    newCommonNames: PlantSpeciesCommonNameValueObject[],
  ): void {
    const oldValue = this._commonNames.map((name) => name.value);
    const newValue = newCommonNames.map((name) => name.value);

    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;

    this._commonNames = newCommonNames;
    this.touch();

    this.apply(
      new PlantSpeciesCommonNamesChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesCommonNamesChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeImages(newImages: PlantSpeciesImageValueObject[]): void {
    const oldValue = this._images.map((image) => image.value);
    const newValue = newImages.map((image) => image.value);

    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;

    this._images = newImages;
    this.touch();

    this.apply(
      new PlantSpeciesImagesChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesImagesChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  private changeExternalIds(
    newExternalIds: PlantSpeciesExternalIdValueObject[],
  ): void {
    const oldValue = this._externalIds.map((externalId) => externalId.value);
    const newValue = newExternalIds.map((externalId) => externalId.value);

    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;

    this._externalIds = newExternalIds;
    this.touch();

    this.apply(
      new PlantSpeciesExternalIdsChangedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesExternalIdsChangedEvent.name,
        },
        { id: this._id.value, oldValue, newValue },
      ),
    );
  }

  public delete(): void {
    this.apply(
      new PlantSpeciesDeletedEvent(
        {
          aggregateRootId: this._id.value,
          aggregateRootType: PlantSpeciesAggregate.name,
          entityId: this._id.value,
          entityType: PlantSpeciesAggregate.name,
          eventType: PlantSpeciesDeletedEvent.name,
        },
        this.toPrimitives(),
      ),
    );
  }

  public toPrimitives(): IPlantSpeciesPrimitives {
    return {
      id: this._id.value,
      scientificName: this._scientificName.value,
      description: this._description?.value ?? null,
      imageUrl: this._imageUrl?.value ?? null,
      classification: this._classification?.value ?? null,
      authorship: this._authorship?.value ?? null,
      growthHabit:
        (this._growthHabit?.value as PlantSpeciesGrowthHabitEnum) ?? null,
      wikipediaUrl: this._wikipediaUrl?.value ?? null,
      commonNames: this._commonNames.map((name) => name.value),
      images: this._images.map((image) => image.value),
      externalIds: this._externalIds.map((externalId) => externalId.value),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  get id(): PlantSpeciesIdValueObject {
    return this._id;
  }

  get scientificName(): PlantSpeciesScientificNameValueObject {
    return this._scientificName;
  }

  get description(): PlantSpeciesDescriptionValueObject | null {
    return this._description;
  }

  get imageUrl(): PlantSpeciesImageUrlValueObject | null {
    return this._imageUrl;
  }

  get classification(): PlantSpeciesClassificationValueObject | null {
    return this._classification;
  }

  get authorship(): PlantSpeciesAuthorshipValueObject | null {
    return this._authorship;
  }

  get growthHabit(): PlantSpeciesGrowthHabitValueObject | null {
    return this._growthHabit;
  }

  get wikipediaUrl(): PlantSpeciesWikipediaUrlValueObject | null {
    return this._wikipediaUrl;
  }

  get commonNames(): PlantSpeciesCommonNameValueObject[] {
    return this._commonNames;
  }

  get images(): PlantSpeciesImageValueObject[] {
    return this._images;
  }

  get externalIds(): PlantSpeciesExternalIdValueObject[] {
    return this._externalIds;
  }
}
