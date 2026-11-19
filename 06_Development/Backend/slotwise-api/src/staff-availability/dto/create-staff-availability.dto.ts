import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateStaffAvailabilityDto {
  @ApiProperty()
  @IsUUID()
  staffId: string;

  @ApiProperty({ example: 1, description: 'Day of week: 0 = Sunday, 6 = Saturday' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime: string;

  @ApiProperty({ example: '18:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isAvailable: boolean;
}
