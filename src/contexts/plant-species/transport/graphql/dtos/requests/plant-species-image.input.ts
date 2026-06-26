import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType('PlantSpeciesImageInput')
export class PlantSpeciesImageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  url!: string;

  @Field(() => Boolean)
  @IsBoolean()
  isPrimary!: boolean;
}
