import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesAuthorshipInput } from '@contexts/plant-species/transport/graphql/dtos/requests/plant-species-authorship.input';
import { PlantSpeciesClassificationInput } from '@contexts/plant-species/transport/graphql/dtos/requests/plant-species-classification.input';
import { PlantSpeciesCommonNameInput } from '@contexts/plant-species/transport/graphql/dtos/requests/plant-species-common-name.input';
import { PlantSpeciesExternalIdInput } from '@contexts/plant-species/transport/graphql/dtos/requests/plant-species-external-id.input';
import { PlantSpeciesImageInput } from '@contexts/plant-species/transport/graphql/dtos/requests/plant-species-image.input';

@InputType('PlantSpeciesUpdateRequestDto')
export class PlantSpeciesUpdateRequestDto {
  @Field(() => String, { description: 'The id of the plant species to update' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Updated globally unique species scientific name',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  scientificName?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Updated species description',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Updated species image URL',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @Field(() => PlantSpeciesClassificationInput, {
    nullable: true,
    description: 'Linnaean classification',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlantSpeciesClassificationInput)
  classification?: PlantSpeciesClassificationInput | null;

  @Field(() => PlantSpeciesAuthorshipInput, {
    nullable: true,
    description: 'Nomenclatural authorship',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlantSpeciesAuthorshipInput)
  authorship?: PlantSpeciesAuthorshipInput | null;

  @Field(() => PlantSpeciesGrowthHabitEnum, {
    nullable: true,
    description: 'Coarse growth form',
  })
  @IsOptional()
  @IsEnum(PlantSpeciesGrowthHabitEnum)
  growthHabit?: PlantSpeciesGrowthHabitEnum | null;

  @Field(() => String, {
    nullable: true,
    description: 'Updated Wikipedia article URL',
  })
  @IsOptional()
  @IsString()
  wikipediaUrl?: string | null;

  @Field(() => [PlantSpeciesCommonNameInput], {
    nullable: true,
    description: 'Vernacular (common) names',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantSpeciesCommonNameInput)
  commonNames?: PlantSpeciesCommonNameInput[];

  @Field(() => [PlantSpeciesImageInput], {
    nullable: true,
    description: 'Image gallery',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantSpeciesImageInput)
  images?: PlantSpeciesImageInput[];

  @Field(() => [PlantSpeciesExternalIdInput], {
    nullable: true,
    description: 'External catalog cross-references',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantSpeciesExternalIdInput)
  externalIds?: PlantSpeciesExternalIdInput[];
}
