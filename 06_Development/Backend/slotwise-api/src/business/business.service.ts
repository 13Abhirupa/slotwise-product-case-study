import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { UpdateBusinessDto } from './dto/update-business.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async findAll(user: AuthenticatedUser): Promise<Business[]> {
    return this.businessRepository.find({
      where: { businessId: user.businessId },
    });
  }

  async findOne(
    id: string,
    user: AuthenticatedUser,
  ): Promise<Business> {
    if (id !== user.businessId) {
      throw new NotFoundException('Business not found.');
    }

    const business = await this.businessRepository.findOneBy({
      businessId: user.businessId,
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    return business;
  }

  async update(
    id: string,
    dto: UpdateBusinessDto,
    user: AuthenticatedUser,
  ): Promise<Business> {
    if (!['OWNER', 'MANAGER'].includes(user.role)) {
      throw new ForbiddenException('Manager access required.');
    }

    const business = await this.findOne(id, user);

    const allowedFields: (keyof UpdateBusinessDto)[] = [
      'businessName',
      'businessType',
      'email',
      'phone',
      'address',
      'timezone',
    ];

    for (const field of allowedFields) {
      if (dto[field] !== undefined) {
        (business as any)[field] = dto[field];
      }
    }

    return this.businessRepository.save(business);
  }
}
