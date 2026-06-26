import { ApiProperty } from '@nestjs/swagger';

export class PlantSpeciesImageRestDto {
  @ApiProperty({ example: 'https://example.com/rosa.jpg' }) url!: string;
  @ApiProperty({ example: true }) isPrimary!: boolean;
}
