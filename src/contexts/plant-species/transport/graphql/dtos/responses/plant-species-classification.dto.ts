import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantSpeciesClassificationDto')
export class PlantSpeciesClassificationDto {
  @Field(() => String, { nullable: true })
  kingdom!: string | null;

  @Field(() => String, { nullable: true })
  phylum!: string | null;

  @Field(() => String, { nullable: true })
  class!: string | null;

  @Field(() => String, { nullable: true })
  order!: string | null;

  @Field(() => String, { nullable: true })
  family!: string | null;

  @Field(() => String, { nullable: true })
  genus!: string | null;

  @Field(() => String, { nullable: true })
  specificEpithet!: string | null;

  @Field(() => String, { nullable: true })
  rank!: string | null;
}
