import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { MoveReason, PayType } from '@prisma/client';

export class CreateStockMoveDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.001)
  qtyDelta: number;

  @IsEnum(MoveReason)
  @IsNotEmpty()
  reason: MoveReason;

  @IsString()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  unitPrice?: number;

  @IsEnum(PayType)
  @IsOptional()
  payType?: PayType;

  @IsString()
  @IsOptional()
  note?: string;
}
