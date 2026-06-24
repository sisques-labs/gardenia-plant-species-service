import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';

export class PlantSpeciesClassificationRestDto {
  @ApiPropertyOptional({ nullable: true }) kingdom!: string | null;
  @ApiPropertyOptional({ nullable: true }) phylum!: string | null;
  @ApiPropertyOptional({ nullable: true }) class!: string | null;
  @ApiPropertyOptional({ nullable: true }) order!: string | null;
  @ApiPropertyOptional({ nullable: true }) family!: string | null;
  @ApiPropertyOptional({ nullable: true }) genus!: string | null;
  @ApiPropertyOptional({ nullable: true }) specificEpithet!: string | null;
  @ApiPropertyOptional({ nullable: true }) rank!: string | null;
}

export class PlantSpeciesAuthorshipRestDto {
  @ApiPropertyOptional({ nullable: true, example: 'L.' })
  author!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 1753 })
  year!: number | null;
}

export class PlantSpeciesCommonNameRestDto {
  @ApiProperty({ example: 'Dog rose' }) name!: string;
  @ApiPropertyOptional({ nullable: true, example: 'en' })
  language!: string | null;
  @ApiProperty({ enum: PlantSpeciesSourceEnum })
  source!: PlantSpeciesSourceEnum;
}

export class PlantSpeciesImageRestDto {
  @ApiProperty({ example: 'https://example.com/rosa.jpg' }) url!: string;
  @ApiProperty({ enum: PlantSpeciesSourceEnum })
  source!: PlantSpeciesSourceEnum;
  @ApiProperty({ example: true }) isPrimary!: boolean;
}

export class PlantSpeciesExternalIdRestDto {
  @ApiProperty({ enum: PlantSpeciesExternalIdSchemeEnum })
  scheme!: PlantSpeciesExternalIdSchemeEnum;
  @ApiProperty({ example: '2705959' }) value!: string;
}

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

  @ApiProperty({
    enum: PlantSpeciesSourceEnum,
    description: 'Where this record originated',
  })
  source!: PlantSpeciesSourceEnum;

  @ApiPropertyOptional({
    nullable: true,
    description: 'When the record was last enriched from external sources',
  })
  lastEnrichedAt!: Date | null;

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
