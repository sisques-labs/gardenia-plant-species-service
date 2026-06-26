import { ApiPropertyOptional } from '@nestjs/swagger';

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
