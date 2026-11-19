import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  businessId: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;

  @ApiProperty()
  @IsUUID()
  staffId: string;

  @ApiProperty({ example: '2026-12-25' })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({ example: '10:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime: string;

  @ApiProperty({ example: '11:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime: string;

  @ApiProperty({ example: 'CONFIRMED' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  appointmentStatus: string;

  @ApiProperty({ example: 'WALK_IN' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  bookingSource: string;

  @ApiPropertyOptional({ example: 'Customer requested a morning slot.' })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
