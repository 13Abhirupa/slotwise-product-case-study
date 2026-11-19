import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateBusinessStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  status: string;
}
