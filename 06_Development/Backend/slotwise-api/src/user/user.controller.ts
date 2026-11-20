import {
  Controller,
  ForbiddenException,
  Get,
  Injectable,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BusinessMembership } from '../business-membership/entities/business-membership.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

const safeFields = {
  userId: true,
  fullName: true,
  email: true,
  accountStatus: true,
  createdAt: true,
  updatedAt: true,
} as const;

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessMembership)
    private readonly membershipRepository: Repository<BusinessMembership>,
  ) {}

  @Get('me')
  async me(@CurrentUser() currentUser: AuthenticatedUser) {
    const user = await this.userRepository.findOne({
      where: { userId: currentUser.userId },
      select: safeFields,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Get()
  async findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    if (!['OWNER', 'MANAGER'].includes(currentUser.role)) {
      throw new ForbiddenException('Manager access required.');
    }

    const memberships = await this.membershipRepository.find({
      where: {
        businessId: currentUser.businessId,
        membershipStatus: 'ACTIVE',
      },
      select: { userId: true },
    });

    const userIds = [...new Set(memberships.map(m => m.userId))];

    if (!userIds.length) {
      return [];
    }

    return this.userRepository.find({
      where: { userId: In(userIds) },
      select: safeFields,
      order: { fullName: 'ASC' },
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    if (id !== currentUser.userId) {
      if (!['OWNER', 'MANAGER'].includes(currentUser.role)) {
        throw new NotFoundException('User not found.');
      }

      const membership = await this.membershipRepository.findOne({
        where: {
          userId: id,
          businessId: currentUser.businessId,
          membershipStatus: 'ACTIVE',
        },
      });

      if (!membership) {
        throw new NotFoundException('User not found.');
      }
    }

    const user = await this.userRepository.findOne({
      where: { userId: id },
      select: safeFields,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
