import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('PlantSpeciesCommonNameInput')
export class PlantSpeciesCommonNameInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  language!: string | null;
}
