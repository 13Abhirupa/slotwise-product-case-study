import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessMembership } from './entities/business-membership.entity';
import { Business } from '../business/entities/business.entity';
import { User } from '../user/entities/user.entity';
import { CreateBusinessMembershipDto } from './dto/create-business-membership.dto';
import { UpdateBusinessMembershipDto } from './dto/update-business-membership.dto';
import { UpdateBusinessMembershipStatusDto } from './dto/update-business-membership-status.dto';

@Injectable()
export class BusinessMembershipService {
  constructor(
    @InjectRepository(BusinessMembership)
    private readonly membershipRepository: Repository<BusinessMembership>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createDto: CreateBusinessMembershipDto,
  ): Promise<BusinessMembership> {
    const business = await this.businessRepository.findOneBy({
      businessId: createDto.businessId,
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    const user = await this.userRepository.findOneBy({
      userId: createDto.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const existingMembership = await this.membershipRepository.findOneBy({
      businessId: createDto.businessId,
      userId: createDto.userId,
    });

    if (existingMembership) {
      throw new ConflictException(
        'This user is already associated with this business.',
      );
    }

    const membership = this.membershipRepository.create(createDto);

    return this.membershipRepository.save(membership);
  }

  async findAll(): Promise<BusinessMembership[]> {
    return this.membershipRepository.find();
  }

  async findOne(id: string): Promise<BusinessMembership> {
    const membership = await this.membershipRepository.findOneBy({
      membershipId: id,
    });

    if (!membership) {
      throw new NotFoundException(
        `Business membership with ID ${id} not found.`,
      );
    }

    return membership;
  }

  async update(
    id: string,
    updateDto: UpdateBusinessMembershipDto,
  ): Promise<BusinessMembership> {
    const membership = await this.findOne(id);

    membership.role = updateDto.role;

    return this.membershipRepository.save(membership);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateBusinessMembershipStatusDto,
  ): Promise<BusinessMembership> {
    const membership = await this.findOne(id);

    membership.membershipStatus = updateDto.membershipStatus;

    return this.membershipRepository.save(membership);
  }
}
