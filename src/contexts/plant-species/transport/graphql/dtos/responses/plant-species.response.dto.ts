import { BasePaginatedResultDto } from '@sisques-labs/nestjs-kit';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';

@ObjectType('PlantSpeciesClassificationDto')
export class PlantSpeciesClassificationDto {
  @Field(() => String, { nullable: true })
  kingdom!: string | null;

  @Field(() => String, { nullable: true })
  phylum!: string | null;

  @Field(() => String, { nullable: true })
  class!: string | null;

  @Field(() => String, { nullable: true })
  order!: string | null;

  @Field(() => String, { nullable: true })
  family!: string | null;

  @Field(() => String, { nullable: true })
  genus!: string | null;

  @Field(() => String, { nullable: true })
  specificEpithet!: string | null;

  @Field(() => String, { nullable: true })
  rank!: string | null;
}

@ObjectType('PlantSpeciesAuthorshipDto')
export class PlantSpeciesAuthorshipDto {
  @Field(() => String, { nullable: true })
  author!: string | null;

  @Field(() => Int, { nullable: true })
  year!: number | null;
}

@ObjectType('PlantSpeciesCommonNameDto')
export class PlantSpeciesCommonNameDto {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  language!: string | null;
}

@ObjectType('PlantSpeciesImageDto')
export class PlantSpeciesImageDto {
  @Field(() => String)
  url!: string;

  @Field(() => Boolean)
  isPrimary!: boolean;
}

@ObjectType('PlantSpeciesExternalIdDto')
export class PlantSpeciesExternalIdDto {
  @Field(() => String)
  scheme!: string;

  @Field(() => String)
  value!: string;
}

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

@ObjectType('PaginatedPlantSpeciesResultDto')
export class PaginatedPlantSpeciesResultDto extends BasePaginatedResultDto {
  @Field(() => [PlantSpeciesResponseDto], {
    description: 'The plant species entries in the current page',
  })
  items!: PlantSpeciesResponseDto[];
}
