import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('PlantSpeciesExternalIdInput')
export class PlantSpeciesExternalIdInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  scheme!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  value!: string;
}
