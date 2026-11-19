import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty()
  @IsUUID()
  businessId: string;

  @ApiProperty({ example: 'Haircut' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  serviceName: string;

  @ApiPropertyOptional({ example: 'Professional haircut service' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: '500.00' })
  @IsNumberString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  price: string;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  serviceStatus: string;
}
