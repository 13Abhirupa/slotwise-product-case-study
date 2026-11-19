import { IsIn } from 'class-validator';

export class UpdateStaffStatusDto {
  @IsIn(['ACTIVE', 'INACTIVE'])
  employmentStatus: string;
}
