import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PlantSpeciesAuthorshipInputDto {
  @ApiPropertyOptional({ nullable: true, example: 'L.' })
  @IsOptional()
  @IsString()
  author!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 1753 })
  @IsOptional()
  @IsInt()
  year!: number | null;
}
