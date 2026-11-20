import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Business } from '../business/entities/business.entity';
import { BusinessMembership } from '../business-membership/entities/business-membership.entity';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      Business,
      BusinessMembership,
    ]),
    AuthModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [TypeOrmModule, StaffService],
})
export class StaffModule {}
