import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService as StaffServiceEntity } from './entities/staff-service.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Service } from '../service/entities/service.entity';
import { StaffServiceController } from './staff-service.controller';
import { StaffServiceService } from './staff-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffServiceEntity,
      Staff,
      Service,
    ]),
  ],
  controllers: [StaffServiceController],
  providers: [StaffServiceService],
  exports: [StaffServiceService],
})
export class StaffServiceModule {}
