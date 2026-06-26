import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType('PlantSpeciesClassificationInput')
export class PlantSpeciesClassificationInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  kingdom!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phylum!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  class!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  order!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  family!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  genus!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  specificEpithet!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  rank!: string | null;
}
