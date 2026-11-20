import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(
    createDto: CreateServiceDto,
    user: AuthenticatedUser,
  ): Promise<Service> {
    const business = await this.businessRepository.findOneBy({
      businessId: user.businessId,
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    const service = this.serviceRepository.create({
      ...createDto,
      businessId: user.businessId,
    });

    return this.serviceRepository.save(service);
  }

  async findAll(user: AuthenticatedUser): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { businessId: user.businessId },
    });
  }

  async findOne(
    id: string,
    user: AuthenticatedUser,
  ): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({
      serviceId: id,
      businessId: user.businessId,
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    return service;
  }

  async update(
    id: string,
    updateDto: UpdateServiceDto,
    user: AuthenticatedUser,
  ): Promise<Service> {
    const service = await this.findOne(id, user);

    const allowedUpdates = updateDto;
    Object.assign(service, allowedUpdates);

    return this.serviceRepository.save(service);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateServiceStatusDto,
    user: AuthenticatedUser,
  ): Promise<Service> {
    const service = await this.findOne(id, user);

    service.serviceStatus = updateDto.serviceStatus;

    return this.serviceRepository.save(service);
  }
}

