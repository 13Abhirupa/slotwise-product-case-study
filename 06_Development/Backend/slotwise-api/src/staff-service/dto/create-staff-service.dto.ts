import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateStaffServiceDto {
  @ApiProperty({ description: 'ID of the staff member' })
  @IsUUID()
  staffId: string;

  @ApiProperty({ description: 'ID of the service' })
  @IsUUID()
  serviceId: string;
}
