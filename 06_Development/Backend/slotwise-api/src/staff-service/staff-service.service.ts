import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffService as StaffServiceEntity } from './entities/staff-service.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Service } from '../service/entities/service.entity';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';

@Injectable()
export class StaffServiceService {
  constructor(
    @InjectRepository(StaffServiceEntity)
    private readonly staffServiceRepository: Repository<StaffServiceEntity>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createDto: CreateStaffServiceDto): Promise<StaffServiceEntity> {
    const staff = await this.staffRepository.findOneBy({
      staffId: createDto.staffId,
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found.');
    }

    const service = await this.serviceRepository.findOneBy({
      serviceId: createDto.serviceId,
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    if (staff.businessId !== service.businessId) {
      throw new BadRequestException(
        'Staff member and service must belong to the same business.',
      );
    }

    const existingAssignment = await this.staffServiceRepository.findOneBy({
      staffId: createDto.staffId,
      serviceId: createDto.serviceId,
    });

    if (existingAssignment) {
      throw new ConflictException(
        'This service is already assigned to this staff member.',
      );
    }

    const assignment = this.staffServiceRepository.create(createDto);

    return this.staffServiceRepository.save(assignment);
  }

  async findAll(): Promise<StaffServiceEntity[]> {
    return this.staffServiceRepository.find();
  }

  async findOne(id: string): Promise<StaffServiceEntity> {
    const assignment = await this.staffServiceRepository.findOneBy({
      staffServiceId: id,
    });

    if (!assignment) {
      throw new NotFoundException(
        `Staff service assignment with ID ${id} not found.`,
      );
    }

    return assignment;
  }

  async remove(id: string): Promise<{ message: string }> {
    const assignment = await this.findOne(id);

    await this.staffServiceRepository.remove(assignment);

    return {
      message: 'Staff service assignment removed successfully.',
    };
  }
}
