import { IsOptional, IsString, IsDateString } from 'class-validator';

export class BaseDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}
