import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantSpeciesImageDto')
export class PlantSpeciesImageDto {
  @Field(() => String)
  url!: string;

  @Field(() => Boolean)
  isPrimary!: boolean;
}
