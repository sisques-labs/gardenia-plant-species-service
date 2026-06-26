import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesAuthorshipRestDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-authorship-rest.dto';
import { PlantSpeciesClassificationRestDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-classification-rest.dto';
import { PlantSpeciesCommonNameRestDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-common-name-rest.dto';
import { PlantSpeciesExternalIdRestDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-external-id-rest.dto';
import { PlantSpeciesImageRestDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-image-rest.dto';

export class PlantSpeciesRestResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the plant species catalog entry',
  })
  id!: string;

  @ApiProperty({
    example: 'Rosa canina',
    description: 'Globally unique species scientific name',
  })
  scientificName!: string;

  @ApiPropertyOptional({
    example: 'A deciduous shrub.',
    description: 'Species description',
    nullable: true,
  })
  description!: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/rosa.jpg',
    description: 'Cover/primary species image URL',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiPropertyOptional({
    type: PlantSpeciesClassificationRestDto,
    nullable: true,
  })
  classification!: PlantSpeciesClassificationRestDto | null;

  @ApiPropertyOptional({ type: PlantSpeciesAuthorshipRestDto, nullable: true })
  authorship!: PlantSpeciesAuthorshipRestDto | null;

  @ApiPropertyOptional({ enum: PlantSpeciesGrowthHabitEnum, nullable: true })
  growthHabit!: PlantSpeciesGrowthHabitEnum | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Wikipedia article URL',
  })
  wikipediaUrl!: string | null;

  @ApiProperty({ type: [PlantSpeciesCommonNameRestDto] })
  commonNames!: PlantSpeciesCommonNameRestDto[];

  @ApiProperty({ type: [PlantSpeciesImageRestDto] })
  images!: PlantSpeciesImageRestDto[];

  @ApiProperty({ type: [PlantSpeciesExternalIdRestDto] })
  externalIds!: PlantSpeciesExternalIdRestDto[];

  @ApiProperty({ description: 'When the catalog entry was created' })
  createdAt!: Date;

  @ApiProperty({ description: 'When the catalog entry was last updated' })
  updatedAt!: Date;
}
