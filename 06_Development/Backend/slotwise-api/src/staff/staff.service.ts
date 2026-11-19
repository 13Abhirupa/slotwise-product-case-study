import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { Business } from '../business/entities/business.entity';
import { BusinessMembership } from '../business-membership/entities/business-membership.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateStaffStatusDto } from './dto/update-staff-status.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,

    @InjectRepository(BusinessMembership)
    private readonly membershipRepository: Repository<BusinessMembership>,
  ) {}

  async create(createDto: CreateStaffDto): Promise<Staff> {
    const business = await this.businessRepository.findOneBy({
      businessId: createDto.businessId,
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    if (createDto.membershipId) {
      await this.validateMembership(
        createDto.membershipId,
        createDto.businessId,
      );
    }

    const staff = this.staffRepository.create({
      ...createDto,
      membershipId: createDto.membershipId ?? null,
      phone: createDto.phone ?? null,
      email: createDto.email ?? null,
    });

    return this.staffRepository.save(staff);
  }

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find();
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOneBy({
      staffId: id,
    });

    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found.`);
    }

    return staff;
  }

  async update(id: string, updateDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);

    if (
      Object.prototype.hasOwnProperty.call(updateDto, 'membershipId')
    ) {
      if (updateDto.membershipId) {
        await this.validateMembership(
          updateDto.membershipId,
          staff.businessId,
        );
      }

      staff.membershipId = updateDto.membershipId ?? null;
    }

    if (updateDto.fullName !== undefined) {
      staff.fullName = updateDto.fullName;
    }

    if (updateDto.phone !== undefined) {
      staff.phone = updateDto.phone;
    }

    if (updateDto.email !== undefined) {
      staff.email = updateDto.email;
    }

    return this.staffRepository.save(staff);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateStaffStatusDto,
  ): Promise<Staff> {
    const staff = await this.findOne(id);
    staff.employmentStatus = updateDto.employmentStatus;
    return this.staffRepository.save(staff);
  }

  private async validateMembership(
    membershipId: string,
    businessId: string,
  ): Promise<void> {
    const membership = await this.membershipRepository.findOneBy({
      membershipId,
    });

    if (!membership) {
      throw new NotFoundException('Business membership not found.');
    }

    if (membership.businessId !== businessId) {
      throw new BadRequestException(
        'The membership does not belong to the selected business.',
      );
    }
  }
}
