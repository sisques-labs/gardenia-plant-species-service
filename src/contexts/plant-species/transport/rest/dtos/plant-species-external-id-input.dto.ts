import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlantSpeciesExternalIdInputDto {
  @ApiProperty({ example: 'GBIF' })
  @IsString()
  @IsNotEmpty()
  scheme!: string;

  @ApiProperty({ example: '2705959' })
  @IsString()
  @IsNotEmpty()
  value!: string;
}
