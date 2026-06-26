import { ApiProperty } from '@nestjs/swagger';

export class PlantSpeciesExternalIdRestDto {
  @ApiProperty({ example: 'GBIF' }) scheme!: string;
  @ApiProperty({ example: '2705959' }) value!: string;
}
