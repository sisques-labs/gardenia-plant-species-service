import { ApiProperty } from '@nestjs/swagger';

export class IngestPlantSpeciesResponseDto {
  @ApiProperty({
    example: 2,
    description: 'Number of species names accepted and enqueued for the worker',
  })
  accepted!: number;
}
