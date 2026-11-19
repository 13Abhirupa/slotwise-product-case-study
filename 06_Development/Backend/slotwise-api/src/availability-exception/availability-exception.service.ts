import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailabilityException } from './entities/availability-exception.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CreateAvailabilityExceptionDto } from './dto/create-availability-exception.dto';
import { UpdateAvailabilityExceptionDto } from './dto/update-availability-exception.dto';

@Injectable()
export class AvailabilityExceptionService {
  constructor(
    @InjectRepository(AvailabilityException)
    private readonly exceptionRepository: Repository<AvailabilityException>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async create(dto: CreateAvailabilityExceptionDto) {
    const staff = await this.staffRepository.findOneBy({
      staffId: dto.staffId,
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found.');
    }

    this.validateTimeRange(dto.startTime ?? null, dto.endTime ?? null);

    const exception = this.exceptionRepository.create({
      ...dto,
      startTime: dto.startTime ?? null,
      endTime: dto.endTime ?? null,
    });

    return this.exceptionRepository.save(exception);
  }

  async findAll() {
    return this.exceptionRepository.find();
  }

  async findOne(id: string) {
    const exception = await this.exceptionRepository.findOneBy({
      exceptionId: id,
    });

    if (!exception) {
      throw new NotFoundException(
        `Availability exception with ID ${id} not found.`,
      );
    }

    return exception;
  }

  async update(id: string, dto: UpdateAvailabilityExceptionDto) {
    const exception = await this.findOne(id);

    const startTime =
      dto.startTime !== undefined ? dto.startTime : exception.startTime;

    const endTime =
      dto.endTime !== undefined ? dto.endTime : exception.endTime;

    this.validateTimeRange(startTime ?? null, endTime ?? null);

    Object.assign(exception, dto);

    return this.exceptionRepository.save(exception);
  }

  async remove(id: string) {
    const exception = await this.findOne(id);

    await this.exceptionRepository.remove(exception);

    return {
      message: 'Availability exception deleted successfully.',
    };
  }

  private validateTimeRange(
    startTime: string | null,
    endTime: string | null,
  ) {
    if ((startTime === null) !== (endTime === null)) {
      throw new BadRequestException(
        'Provide both start time and end time, or leave both empty for a full-day exception.',
      );
    }

    if (startTime !== null && endTime !== null && startTime >= endTime) {
      throw new BadRequestException(
        'End time must be later than start time.',
      );
    }
  }
}
