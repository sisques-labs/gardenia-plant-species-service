import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { PlantSpeciesAuthorshipInputDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-authorship-input.dto';
import { PlantSpeciesClassificationInputDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-classification-input.dto';
import { PlantSpeciesCommonNameInputDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-common-name-input.dto';
import { PlantSpeciesExternalIdInputDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-external-id-input.dto';
import { PlantSpeciesImageInputDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-image-input.dto';

export class CreatePlantSpeciesDto {
  @ApiProperty({
    example: 'Monstera deliciosa',
    description: 'Globally unique species scientific name',
  })
  @IsString()
  @IsNotEmpty()
  scientificName!: string;

  @ApiPropertyOptional({
    example: 'A tropical flowering plant species.',
    description: 'Species description',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/monstera.jpg',
    description: 'Cover/primary species image URL',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @ApiPropertyOptional({ type: PlantSpeciesClassificationInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlantSpeciesClassificationInputDto)
  classification?: PlantSpeciesClassificationInputDto | null;

  @ApiPropertyOptional({ type: PlantSpeciesAuthorshipInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlantSpeciesAuthorshipInputDto)
  authorship?: PlantSpeciesAuthorshipInputDto | null;

  @ApiPropertyOptional({ enum: PlantSpeciesGrowthHabitEnum })
  @IsOptional()
  @IsEnum(PlantSpeciesGrowthHabitEnum)
  growthHabit?: PlantSpeciesGrowthHabitEnum | null;

  @ApiPropertyOptional({
    example: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
    description: 'Wikipedia article URL',
  })
  @IsOptional()
  @IsString()
  wikipediaUrl?: string | null;

  @ApiPropertyOptional({ type: [PlantSpeciesCommonNameInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantSpeciesCommonNameInputDto)
  commonNames?: PlantSpeciesCommonNameInputDto[];

  @ApiPropertyOptional({ type: [PlantSpeciesImageInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantSpeciesImageInputDto)
  images?: PlantSpeciesImageInputDto[];

  @ApiPropertyOptional({ type: [PlantSpeciesExternalIdInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantSpeciesExternalIdInputDto)
  externalIds?: PlantSpeciesExternalIdInputDto[];
}
