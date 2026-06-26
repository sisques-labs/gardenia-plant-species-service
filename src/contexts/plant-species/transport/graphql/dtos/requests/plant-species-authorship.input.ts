import { Field, Int, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType('PlantSpeciesAuthorshipInput')
export class PlantSpeciesAuthorshipInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  author!: string | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  year!: number | null;
}
