import { ApiPropertyOptional } from '@nestjs/swagger';

export class PlantSpeciesAuthorshipRestDto {
  @ApiPropertyOptional({ nullable: true, example: 'L.' })
  author!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 1753 })
  year!: number | null;
}
