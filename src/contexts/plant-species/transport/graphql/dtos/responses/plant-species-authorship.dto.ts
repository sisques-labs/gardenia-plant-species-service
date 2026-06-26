import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantSpeciesAuthorshipDto')
export class PlantSpeciesAuthorshipDto {
  @Field(() => String, { nullable: true })
  author!: string | null;

  @Field(() => Int, { nullable: true })
  year!: number | null;
}
