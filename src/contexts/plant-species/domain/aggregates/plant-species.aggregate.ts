import { BaseAggregate, DateValueObject } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';
import { PlantSpeciesDescriptionChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-description-changed/plant-species-description-changed.event';
import { PlantSpeciesImageUrlChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-image-url-changed/plant-species-image-url-changed.event';
import { PlantSpeciesScientificNameChangedEvent } from '@contexts/plant-species/domain/events/field-changed/plant-species-scientific-name-changed/plant-species-scientific-name-changed.event';
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
import { PlantSpeciesSourceValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-source/plant-species-source.value-object';
import { PlantSpeciesWikipediaUrlValueObject } from '@contexts/plant-species/domain/value-objects/plant-species-wikipedia-url/plant-species-wikipedia-url.value-object';

/** Optional fields an enrichment pass (GBIF/Wikidata) can set on a species. */
export interface PlantSpeciesEnrichmentProps {
  description?: PlantSpeciesDescriptionValueObject | null;
  imageUrl?: PlantSpeciesImageUrlValueObject | null;
  classification?: PlantSpeciesClassificationValueObject | null;
  authorship?: PlantSpeciesAuthorshipValueObject | null;
  growthHabit?: PlantSpeciesGrowthHabitValueObject | null;
  wikipediaUrl?: PlantSpeciesWikipediaUrlValueObject | null;
  commonNames?: PlantSpeciesCommonNameValueObject[];
  images?: PlantSpeciesImageValueObject[];
  externalIds?: PlantSpeciesExternalIdValueObject[];
  source?: PlantSpeciesSourceValueObject;
}

export class PlantSpeciesAggregate extends BaseAggregate {
  private readonly _id: PlantSpeciesIdValueObject;
  private _scientificName: PlantSpeciesScientificNameValueObject;
  private _description: PlantSpeciesDescriptionValueObject | null;
  private _imageUrl: PlantSpeciesImageUrlValueObject | null;
  private _classification: PlantSpeciesClassificationValueObject | null;
  private _authorship: PlantSpeciesAuthorshipValueObject | null;
  private _growthHabit: PlantSpeciesGrowthHabitValueObject | null;
  private _wikipediaUrl: PlantSpeciesWikipediaUrlValueObject | null;
  private _source: PlantSpeciesSourceValueObject;
  private _lastEnrichedAt: DateValueObject | null;
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
    this._source = props.source;
    this._lastEnrichedAt = props.lastEnrichedAt;
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

  /**
   * Merges externally-sourced data (GBIF/Wikidata) into the aggregate. Only the
   * fields present in `props` are touched; collections are replaced wholesale with
   * the caller-provided (already de-duplicated/merged) set. Stamps `lastEnrichedAt`.
   */
  public enrich(props: PlantSpeciesEnrichmentProps): void {
    if (props.description !== undefined) this._description = props.description;
    if (props.imageUrl !== undefined) this._imageUrl = props.imageUrl;
    if (props.classification !== undefined) {
      this._classification = props.classification;
    }
    if (props.authorship !== undefined) this._authorship = props.authorship;
    if (props.growthHabit !== undefined) this._growthHabit = props.growthHabit;
    if (props.wikipediaUrl !== undefined) {
      this._wikipediaUrl = props.wikipediaUrl;
    }
    if (props.commonNames !== undefined) this._commonNames = props.commonNames;
    if (props.images !== undefined) this._images = props.images;
    if (props.externalIds !== undefined) this._externalIds = props.externalIds;
    if (props.source !== undefined) this._source = props.source;

    this._lastEnrichedAt = new DateValueObject(new Date());
    this.touch();

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
      source: this._source.value as PlantSpeciesSourceEnum,
      lastEnrichedAt: this._lastEnrichedAt?.value ?? null,
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

  get source(): PlantSpeciesSourceValueObject {
    return this._source;
  }

  get lastEnrichedAt(): DateValueObject | null {
    return this._lastEnrichedAt;
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
