import { Field, ID, ObjectType } from '@nestjs/graphql';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesAuthorshipDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species-authorship.dto';
import { PlantSpeciesClassificationDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species-classification.dto';
import { PlantSpeciesCommonNameDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species-common-name.dto';
import { PlantSpeciesExternalIdDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species-external-id.dto';
import { PlantSpeciesImageDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species-image.dto';

@ObjectType('PlantSpeciesResponseDto')
export class PlantSpeciesResponseDto {
  @Field(() => ID, { description: 'The id of the plant species catalog entry' })
  id!: string;

  @Field(() => String, {
    description: 'Globally unique species scientific name',
  })
  scientificName!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Species description',
  })
  description!: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Cover/primary species image URL',
  })
  imageUrl!: string | null;

  @Field(() => PlantSpeciesClassificationDto, {
    nullable: true,
    description: 'Linnaean classification',
  })
  classification!: PlantSpeciesClassificationDto | null;

  @Field(() => PlantSpeciesAuthorshipDto, {
    nullable: true,
    description: 'Nomenclatural authorship',
  })
  authorship!: PlantSpeciesAuthorshipDto | null;

  @Field(() => PlantSpeciesGrowthHabitEnum, {
    nullable: true,
    description: 'Coarse growth form',
  })
  growthHabit!: PlantSpeciesGrowthHabitEnum | null;

  @Field(() => String, {
    nullable: true,
    description: 'Wikipedia article URL',
  })
  wikipediaUrl!: string | null;

  @Field(() => [PlantSpeciesCommonNameDto], {
    description: 'Vernacular (common) names',
  })
  commonNames!: PlantSpeciesCommonNameDto[];

  @Field(() => [PlantSpeciesImageDto], { description: 'Image gallery' })
  images!: PlantSpeciesImageDto[];

  @Field(() => [PlantSpeciesExternalIdDto], {
    description: 'External catalog cross-references',
  })
  externalIds!: PlantSpeciesExternalIdDto[];

  @Field(() => Date, { description: 'When the catalog entry was created' })
  createdAt!: Date;

  @Field(() => Date, { description: 'When the catalog entry was last updated' })
  updatedAt!: Date;
}
