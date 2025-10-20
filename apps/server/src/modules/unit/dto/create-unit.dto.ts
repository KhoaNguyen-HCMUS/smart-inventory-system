import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
