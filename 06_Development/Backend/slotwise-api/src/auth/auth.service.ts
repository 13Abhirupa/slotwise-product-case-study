import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { BusinessMembership } from '../business-membership/entities/business-membership.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessMembership)
    private readonly membershipRepository: Repository<BusinessMembership>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.accountStatus !== 'ACTIVE') {
      throw new UnauthorizedException('User account is inactive');
    }

    const memberships = await this.membershipRepository.find({
      where: {
        userId: user.userId,
        membershipStatus: 'ACTIVE',
      },
      relations: {
        business: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    if (memberships.length === 0) {
      throw new UnauthorizedException('No active business membership found');
    }

    if (memberships.length > 1) {
      throw new ConflictException(
        'Multiple active business memberships found. Business selection is not yet supported.',
      );
    }

    const membership = memberships[0];

    if (membership.business.status !== 'ACTIVE') {
      throw new UnauthorizedException('Business account is inactive');
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      fullName: user.fullName,
      businessId: membership.businessId,
      membershipId: membership.membershipId,
      role: membership.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '1h',
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      },
      business: {
        businessId: membership.businessId,
        businessName: membership.business.businessName,
        role: membership.role,
      },
    };
  }
}
