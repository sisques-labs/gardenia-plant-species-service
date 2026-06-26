import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlantSpeciesCommonNameRestDto {
  @ApiProperty({ example: 'Dog rose' }) name!: string;
  @ApiPropertyOptional({ nullable: true, example: 'en' })
  language!: string | null;
}
