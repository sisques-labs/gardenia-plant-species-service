import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class IngestPlantSpeciesDto {
  @ApiProperty({
    type: [String],
    example: ['Rosa canina', 'Lavandula angustifolia'],
    description: 'Plant species names to enqueue for asynchronous ingestion',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  names!: string[];
}
