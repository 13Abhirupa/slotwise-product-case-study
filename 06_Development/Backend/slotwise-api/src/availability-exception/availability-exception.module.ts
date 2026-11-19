import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityException } from './entities/availability-exception.entity';
import { Staff } from '../staff/entities/staff.entity';
import { AvailabilityExceptionController } from './availability-exception.controller';
import { AvailabilityExceptionService } from './availability-exception.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailabilityException, Staff]),
  ],
  controllers: [AvailabilityExceptionController],
  providers: [AvailabilityExceptionService],
  exports: [AvailabilityExceptionService],
})
export class AvailabilityExceptionModule {}
