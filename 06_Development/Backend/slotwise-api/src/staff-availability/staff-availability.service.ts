import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffAvailability } from './entities/staff-availability.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { UpdateStaffAvailabilityDto } from './dto/update-staff-availability.dto';

@Injectable()
export class StaffAvailabilityService {
  constructor(
    @InjectRepository(StaffAvailability)
    private readonly availabilityRepository: Repository<StaffAvailability>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async create(dto: CreateStaffAvailabilityDto): Promise<StaffAvailability> {
    const staff = await this.staffRepository.findOneBy({
      staffId: dto.staffId,
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found.');
    }

    this.validateTimeRange(dto.startTime, dto.endTime);

    const availability = this.availabilityRepository.create(dto);
    return this.availabilityRepository.save(availability);
  }

  async findAll(): Promise<StaffAvailability[]> {
    return this.availabilityRepository.find();
  }

  async findOne(id: string): Promise<StaffAvailability> {
    const availability = await this.availabilityRepository.findOneBy({
      availabilityId: id,
    });

    if (!availability) {
      throw new NotFoundException(
        `Staff availability with ID ${id} not found.`,
      );
    }

    return availability;
  }

  async update(
    id: string,
    dto: UpdateStaffAvailabilityDto,
  ): Promise<StaffAvailability> {
    const availability = await this.findOne(id);

    const startTime = dto.startTime ?? availability.startTime;
    const endTime = dto.endTime ?? availability.endTime;

    this.validateTimeRange(startTime, endTime);

    Object.assign(availability, dto);

    return this.availabilityRepository.save(availability);
  }

  async remove(id: string): Promise<{ message: string }> {
    const availability = await this.findOne(id);

    await this.availabilityRepository.remove(availability);

    return {
      message: 'Staff availability deleted successfully.',
    };
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      throw new BadRequestException(
        'End time must be later than start time.',
      );
    }
  }
}
