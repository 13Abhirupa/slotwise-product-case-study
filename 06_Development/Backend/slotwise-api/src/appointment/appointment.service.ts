import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Business } from '../business/entities/business.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    await this.validateReferences(
      dto.businessId,
      dto.staffId,
      dto.customerId,
    );

    this.validateTimeRange(dto.startTime, dto.endTime);

    const appointment = this.appointmentRepository.create({
      ...dto,
      customerId: dto.customerId ?? null,
      notes: dto.notes ?? null,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll() {
    return this.appointmentRepository.find({
      order: {
        appointmentDate: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOneBy({
      appointmentId: id,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    const businessId = dto.businessId ?? appointment.businessId;
    const staffId = dto.staffId ?? appointment.staffId;
    const customerId =
      dto.customerId !== undefined
        ? dto.customerId
        : appointment.customerId;

    await this.validateReferences(businessId, staffId, customerId);

    const startTime = dto.startTime ?? appointment.startTime;
    const endTime = dto.endTime ?? appointment.endTime;

    this.validateTimeRange(startTime, endTime);

    Object.assign(appointment, dto);

    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);

    await this.appointmentRepository.remove(appointment);

    return {
      message: 'Appointment deleted successfully.',
    };
  }

  private async validateReferences(
    businessId: string,
    staffId: string,
    customerId?: string | null,
  ) {
    const business = await this.businessRepository.findOneBy({
      businessId,
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    const staff = await this.staffRepository.findOneBy({
      staffId,
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found.');
    }

    if (staff.businessId !== businessId) {
      throw new BadRequestException(
        'Staff member does not belong to the selected business.',
      );
    }

    if (customerId) {
      const customer = await this.customerRepository.findOneBy({
        customerId,
      });

      if (!customer) {
        throw new NotFoundException('Customer not found.');
      }
    }
  }

  private validateTimeRange(startTime: string, endTime: string) {
    if (startTime >= endTime) {
      throw new BadRequestException(
        'End time must be later than start time.',
      );
    }
  }
}
