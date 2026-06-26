import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PlantSpeciesImageInputDto {
  @ApiProperty({ example: 'https://example.com/rosa.jpg' })
  @IsString()
  @IsNotEmpty()
  url!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPrimary!: boolean;
}
