import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  appointmentId: string;

  @ApiProperty({ example: '500.00' })
  @IsNumberString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  amount: string;

  @ApiProperty({ example: 'CASH' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  paymentMethod: string;

  @ApiProperty({ example: 'COMPLETED' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  paymentStatus: string;

  @ApiPropertyOptional({ example: 'TXN-SW-001', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  transactionReference?: string | null;

  @ApiPropertyOptional({ example: '2026-12-29T12:00:00.000Z', nullable: true })
  @IsOptional()
  @IsString()
  paymentDate?: string | null;
}
