import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessModule } from './business/business.module';
import { UserModule } from './user/user.module';
import { BusinessMembershipModule } from './business-membership/business-membership.module';
import { StaffModule } from './staff/staff.module';
import { ServiceModule } from './service/service.module';
import { StaffServiceModule } from './staff-service/staff-service.module';
import {StaffAvailabilityModule } from './staff-availability/staff-availability.module';
import { AvailabilityExceptionModule } from './availability-exception/availability-exception.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentServiceModule } from './appointment-service/appointment-service.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    BusinessModule,
    UserModule,
    BusinessMembershipModule,
    StaffModule,
    ServiceModule,
    StaffServiceModule,
    StaffAvailabilityModule,
    AvailabilityExceptionModule,
    AppointmentModule,
    AppointmentServiceModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

