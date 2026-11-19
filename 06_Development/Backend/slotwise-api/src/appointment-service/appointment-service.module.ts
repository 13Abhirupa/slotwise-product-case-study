import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService as AppointmentServiceEntity } from './entities/appointment-service.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Service } from '../service/entities/service.entity';
import { AppointmentServiceController } from './appointment-service.controller';
import { AppointmentServiceService } from './appointment-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentServiceEntity,
      Appointment,
      Service,
    ]),
  ],
  controllers: [AppointmentServiceController],
  providers: [AppointmentServiceService],
  exports: [AppointmentServiceService],
})
export class AppointmentServiceModule {}
