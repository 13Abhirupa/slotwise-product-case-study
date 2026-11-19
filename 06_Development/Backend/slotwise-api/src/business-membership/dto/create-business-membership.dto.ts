import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBusinessMembershipDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @IsIn(['OWNER', 'MANAGER', 'STAFF'])
  role: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsIn(['ACTIVE', 'INACTIVE'])
  membershipStatus: string;
}
