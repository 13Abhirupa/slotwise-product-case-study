import { IsIn } from 'class-validator';

export class UpdateBusinessMembershipStatusDto {
  @IsIn(['ACTIVE', 'INACTIVE'])
  membershipStatus: string;
}
