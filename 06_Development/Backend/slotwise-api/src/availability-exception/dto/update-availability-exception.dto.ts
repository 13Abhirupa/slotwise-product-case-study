import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAvailabilityExceptionDto {
  @ApiPropertyOptional({ example: '2026-12-25' })
  @IsOptional()
  @IsDateString()
  exceptionDate?: string;

  @ApiPropertyOptional({ example: '09:00', nullable: true })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime?: string | null;

  @ApiPropertyOptional({ example: '18:00', nullable: true })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime?: string | null;

  @ApiPropertyOptional({ example: 'LEAVE' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  exceptionType?: string;

  @ApiPropertyOptional({ example: 'Updated leave reason' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason?: string;
}
