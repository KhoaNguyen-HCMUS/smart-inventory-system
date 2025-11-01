import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { LedgerType } from '@prisma/client';

export class CreatePayableLedgerDto {
  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsEnum(LedgerType)
  @IsNotEmpty()
  type: LedgerType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amountDelta: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  refMoveId?: string;
}
