import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType('PlantSpeciesIngestRequestDto')
export class PlantSpeciesIngestRequestDto {
  @Field(() => [String], {
    description: 'Plant species names to enqueue for asynchronous ingestion',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  names!: string[];
}
