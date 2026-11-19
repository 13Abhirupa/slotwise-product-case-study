import {
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ example: '500.00' })
  @IsOptional()
  @IsNumberString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  amount?: string;

  @ApiPropertyOptional({ example: 'CASH' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'COMPLETED' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  paymentStatus?: string;

  @ApiPropertyOptional({ example: 'TXN-SW-002', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  transactionReference?: string | null;

  @ApiPropertyOptional({ example: '2026-12-29T12:00:00.000Z', nullable: true })
  @IsOptional()
  @IsString()
  paymentDate?: string | null;
}
