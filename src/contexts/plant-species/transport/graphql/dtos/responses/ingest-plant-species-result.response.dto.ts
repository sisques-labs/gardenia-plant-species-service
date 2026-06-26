import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('IngestPlantSpeciesResultResponseDto')
export class IngestPlantSpeciesResultResponseDto {
  @Field(() => Int, {
    description: 'Number of species names accepted and enqueued for the worker',
  })
  accepted!: number;
}
