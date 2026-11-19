import {
  IsIn,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateBusinessMembershipDto {
  @IsString()
  @MaxLength(30)
  @IsIn(['OWNER', 'MANAGER', 'STAFF'])
  role: string;
}
