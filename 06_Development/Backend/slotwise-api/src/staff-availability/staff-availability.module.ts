import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffAvailability } from './entities/staff-availability.entity';
import { Staff } from '../staff/entities/staff.entity';
import { StaffAvailabilityController } from './staff-availability.controller';
import { StaffAvailabilityService } from './staff-availability.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffAvailability, Staff]),
  ],
  controllers: [StaffAvailabilityController],
  providers: [StaffAvailabilityService],
  exports: [StaffAvailabilityService],
})
export class StaffAvailabilityModule {}
