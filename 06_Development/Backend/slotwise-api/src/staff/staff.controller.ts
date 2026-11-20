import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('staff')
export class StaffController {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    const staff = await this.staffRepository.findOne({
      where: {
        membershipId: user.membershipId,
        businessId: user.businessId,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff profile not found.');
    }

    return staff;
  }

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    if (['OWNER', 'MANAGER'].includes(user.role)) {
      return this.staffRepository.find({
        where: { businessId: user.businessId },
      });
    }

    return this.staffRepository.find({
      where: {
        membershipId: user.membershipId,
        businessId: user.businessId,
      },
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const where: {
      staffId: string;
      businessId: string;
      membershipId?: string;
    } = {
      staffId: id,
      businessId: user.businessId,
    };

    if (!['OWNER', 'MANAGER'].includes(user.role)) {
      where.membershipId = user.membershipId;
    }

    const staff = await this.staffRepository.findOne({ where });

    if (!staff) {
      throw new NotFoundException('Staff profile not found.');
    }

    return staff;
  }
}
