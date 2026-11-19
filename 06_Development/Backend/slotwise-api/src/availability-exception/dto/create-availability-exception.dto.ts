import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvailabilityExceptionDto {
  @ApiProperty()
  @IsUUID()
  staffId: string;

  @ApiProperty({ example: '2026-12-25' })
  @IsDateString()
  exceptionDate: string;

  @ApiPropertyOptional({ example: '09:00', nullable: true })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime?: string | null;

  @ApiPropertyOptional({ example: '18:00', nullable: true })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime?: string | null;

  @ApiProperty({ example: 'LEAVE' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  exceptionType: string;

  @ApiProperty({ example: 'Staff member on annual leave' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;
}
