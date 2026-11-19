import { IsIn } from 'class-validator';

export class UpdateUserStatusDto {
  @IsIn(['ACTIVE', 'INACTIVE'])
  accountStatus: string;
}
