import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentService as AppointmentServiceEntity } from './entities/appointment-service.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Service } from '../service/entities/service.entity';
import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';

@Injectable()
export class AppointmentServiceService {
  constructor(
    @InjectRepository(AppointmentServiceEntity)
    private readonly appointmentServiceRepository: Repository<AppointmentServiceEntity>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(dto: CreateAppointmentServiceDto) {
    const appointment = await this.appointmentRepository.findOneBy({
      appointmentId: dto.appointmentId,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    const service = await this.serviceRepository.findOneBy({
      serviceId: dto.serviceId,
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    if (appointment.businessId !== service.businessId) {
      throw new BadRequestException(
        'Service does not belong to the appointment business.',
      );
    }

    const existing = await this.appointmentServiceRepository.findOneBy({
      appointmentId: dto.appointmentId,
      serviceId: dto.serviceId,
    });

    if (existing) {
      throw new ConflictException(
        'This service is already added to the appointment.',
      );
    }

    const appointmentService = this.appointmentServiceRepository.create({
      appointmentId: dto.appointmentId,
      serviceId: dto.serviceId,
      servicePrice: service.price,
      serviceDurationMinutes: service.durationMinutes,
    });

    return this.appointmentServiceRepository.save(appointmentService);
  }

  async findAll() {
    return this.appointmentServiceRepository.find();
  }

  async findOne(id: string) {
    const record = await this.appointmentServiceRepository.findOneBy({
      appointmentServiceId: id,
    });

    if (!record) {
      throw new NotFoundException('Appointment service record not found.');
    }

    return record;
  }

  async findByAppointment(appointmentId: string) {
    const appointment = await this.appointmentRepository.findOneBy({
      appointmentId,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    return this.appointmentServiceRepository.findBy({ appointmentId });
  }

  async remove(id: string) {
    const record = await this.findOne(id);

    await this.appointmentServiceRepository.remove(record);

    return {
      message: 'Appointment service removed successfully.',
    };
  }
}
