import {
  BadRequestException,
  ForbiddenException,
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
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

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

  async create(dto: CreateAppointmentDto, user: AuthenticatedUser) {
    this.validateRole(user);

    if (dto.businessId !== user.businessId) {
      throw new ForbiddenException(
        'You cannot create appointments for another business.',
      );
    }

    const assignedStaff = await this.getAssignedStaff(user);

    if (user.role === 'STAFF' && dto.staffId !== assignedStaff.staffId) {
      throw new ForbiddenException(
        'Staff can create appointments only for themselves.',
      );
    }

    await this.validateReferences(
      user.businessId,
      dto.staffId,
      dto.customerId,
    );

    this.validateTimeRange(dto.startTime, dto.endTime);

    const appointment = this.appointmentRepository.create({
      ...dto,
      businessId: user.businessId,
      customerId: dto.customerId ?? null,
      notes: dto.notes ?? null,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(user: AuthenticatedUser) {
    this.validateRole(user);

    const where: {
      businessId: string;
      staffId?: string;
    } = {
      businessId: user.businessId,
    };

    if (user.role === 'STAFF') {
      const staff = await this.getAssignedStaff(user);
      where.staffId = staff.staffId;
    }

    return this.appointmentRepository.find({
      where,
      order: {
        appointmentDate: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: string, user: AuthenticatedUser) {
    this.validateRole(user);

    const where: {
      appointmentId: string;
      businessId: string;
      staffId?: string;
    } = {
      appointmentId: id,
      businessId: user.businessId,
    };

    if (user.role === 'STAFF') {
      const staff = await this.getAssignedStaff(user);
      where.staffId = staff.staffId;
    }

    const appointment = await this.appointmentRepository.findOneBy(where);

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    return appointment;
  }

  async update(
    id: string,
    dto: UpdateAppointmentDto,
    user: AuthenticatedUser,
  ) {
    const appointment = await this.findOne(id, user);

    if (user.role === 'STAFF') {
      if (
        (dto.businessId !== undefined &&
          dto.businessId !== user.businessId) ||
        (dto.staffId !== undefined &&
          dto.staffId !== appointment.staffId)
      ) {
        throw new ForbiddenException(
          'Staff cannot change the appointment business or assigned staff member.',
        );
      }
    }

    const businessId = dto.businessId ?? appointment.businessId;
    const staffId = dto.staffId ?? appointment.staffId;
    const customerId =
      dto.customerId !== undefined
        ? dto.customerId
        : appointment.customerId;

    if (businessId !== user.businessId) {
      throw new ForbiddenException(
        'You cannot move an appointment to another business.',
      );
    }

    await this.validateReferences(businessId, staffId, customerId);

    const startTime = dto.startTime ?? appointment.startTime;
    const endTime = dto.endTime ?? appointment.endTime;

    this.validateTimeRange(startTime, endTime);

    Object.assign(appointment, dto);

    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string, user: AuthenticatedUser) {
    if (user.role === 'STAFF') {
      throw new ForbiddenException(
        'Staff members cannot delete appointments.',
      );
    }

    const appointment = await this.findOne(id, user);

    await this.appointmentRepository.remove(appointment);

    return {
      message: 'Appointment deleted successfully.',
    };
  }

  private validateRole(user: AuthenticatedUser) {
    if (!['OWNER', 'MANAGER', 'STAFF'].includes(user.role)) {
      throw new ForbiddenException('Invalid business role.');
    }
  }

  private async getAssignedStaff(user: AuthenticatedUser) {
    const staff = await this.staffRepository.findOneBy({
      membershipId: user.membershipId,
      businessId: user.businessId,
    });

    if (!staff) {
      throw new ForbiddenException(
        'No staff profile is linked to this account.',
      );
    }

    if (staff.employmentStatus !== 'ACTIVE') {
      throw new ForbiddenException('Staff profile is inactive.');
    }

    return staff;
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

    if (
      staff.businessId !== businessId ||
      staff.employmentStatus !== 'ACTIVE'
    ) {
      throw new BadRequestException(
        'Staff member is inactive or does not belong to the selected business.',
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
