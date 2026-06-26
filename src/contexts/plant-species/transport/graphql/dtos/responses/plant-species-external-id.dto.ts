import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantSpeciesExternalIdDto')
export class PlantSpeciesExternalIdDto {
  @Field(() => String)
  scheme!: string;

  @Field(() => String)
  value!: string;
}
