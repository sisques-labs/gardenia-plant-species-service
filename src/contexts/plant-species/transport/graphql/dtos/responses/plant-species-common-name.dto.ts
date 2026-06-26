import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantSpeciesCommonNameDto')
export class PlantSpeciesCommonNameDto {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  language!: string | null;
}
