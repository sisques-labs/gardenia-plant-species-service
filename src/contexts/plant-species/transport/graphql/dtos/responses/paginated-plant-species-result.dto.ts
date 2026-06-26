import { BasePaginatedResultDto } from '@sisques-labs/nestjs-kit';
import { Field, ObjectType } from '@nestjs/graphql';

import { PlantSpeciesResponseDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species.response.dto';

@ObjectType('PaginatedPlantSpeciesResultDto')
export class PaginatedPlantSpeciesResultDto extends BasePaginatedResultDto {
  @Field(() => [PlantSpeciesResponseDto], {
    description: 'The plant species entries in the current page',
  })
  items!: PlantSpeciesResponseDto[];
}
