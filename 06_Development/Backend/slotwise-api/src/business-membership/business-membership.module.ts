import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessMembership } from './entities/business-membership.entity';
import { Business } from '../business/entities/business.entity';
import { User } from '../user/entities/user.entity';
import { BusinessMembershipController } from './business-membership.controller';
import { BusinessMembershipService } from './business-membership.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessMembership, Business, User]),
  ],
  controllers: [BusinessMembershipController],
  providers: [BusinessMembershipService],
  exports: [BusinessMembershipService],
})
export class BusinessMembershipModule {}
