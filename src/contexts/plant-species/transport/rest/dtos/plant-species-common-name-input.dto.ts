import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlantSpeciesCommonNameInputDto {
  @ApiProperty({ example: 'Dog rose' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ nullable: true, example: 'en' })
  @IsOptional()
  @IsString()
  language!: string | null;
}
