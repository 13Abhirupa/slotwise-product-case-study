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
import { BusinessMembership } from './entities/business-membership.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Business Membership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('business-membership')
export class BusinessMembershipController {
  constructor(
    @InjectRepository(BusinessMembership)
    private readonly membershipRepository: Repository<BusinessMembership>,
  ) {}

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    const membership = await this.membershipRepository.findOne({
      where: {
        membershipId: user.membershipId,
        userId: user.userId,
        businessId: user.businessId,
        membershipStatus: 'ACTIVE',
      },
      select: {
        membershipId: true,
        userId: true,
        businessId: true,
        role: true,
        membershipStatus: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found.');
    }

    return membership;
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.membershipRepository.find({
      where: { businessId: user.businessId },
      select: {
        membershipId: true,
        userId: true,
        businessId: true,
        role: true,
        membershipStatus: true,
      },
    });
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const membership = await this.membershipRepository.findOne({
      where: {
        membershipId: id,
        businessId: user.businessId,
      },
      select: {
        membershipId: true,
        userId: true,
        businessId: true,
        role: true,
        membershipStatus: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found.');
    }

    return membership;
  }
}
