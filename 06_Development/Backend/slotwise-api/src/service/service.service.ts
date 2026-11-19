import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(createDto: CreateServiceDto): Promise<Service> {
    const business = await this.businessRepository.findOneBy({
      businessId: createDto.businessId,
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    const service = this.serviceRepository.create(createDto);
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({
      serviceId: id,
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    return service;
  }

  async update(
    id: string,
    updateDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOne(id);

    Object.assign(service, updateDto);

    return this.serviceRepository.save(service);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateServiceStatusDto,
  ): Promise<Service> {
    const service = await this.findOne(id);

    service.serviceStatus = updateDto.serviceStatus;

    return this.serviceRepository.save(service);
  }
}
