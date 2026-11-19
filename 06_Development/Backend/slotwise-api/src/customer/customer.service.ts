import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Customer } from './entities/customer.entity';
import { Staff } from '../staff/entities/staff.entity';
import { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  private assertManager(user: AuthenticatedUser): void {
    if (!['OWNER', 'MANAGER'].includes(user.role)) {
      throw new ForbiddenException(
        'Only business owners and managers can modify customer records.',
      );
    }
  }

  private async getScopedQuery(
    user: AuthenticatedUser,
  ): Promise<SelectQueryBuilder<Customer>> {
    if (!['OWNER', 'MANAGER', 'STAFF'].includes(user.role)) {
      throw new ForbiddenException('Invalid user role.');
    }

    const query = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.businessId = :businessId', {
        businessId: user.businessId,
      });

    if (user.role === 'STAFF') {
      const staff = await this.staffRepository.findOneBy({
        membershipId: user.membershipId,
        businessId: user.businessId,
      });

      if (!staff || staff.employmentStatus !== 'ACTIVE') {
        throw new ForbiddenException(
          'No active staff profile is linked to this account.',
        );
      }

      query.andWhere(
        `EXISTS (
          SELECT 1
          FROM appointment ap
          WHERE ap.customer_id = customer.customer_id
          AND ap.business_id = :businessId
          AND ap.staff_id = :staffId
        )`,
        {
          businessId: user.businessId,
          staffId: staff.staffId,
        },
      );
    }

    return query;
  }

  async create(
    dto: CreateCustomerDto,
    user: AuthenticatedUser,
  ): Promise<Customer> {
    this.assertManager(user);

    const customer = this.customerRepository.create({
      businessId: user.businessId,
      fullName: dto.fullName,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      notes: dto.notes ?? null,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(user: AuthenticatedUser): Promise<Customer[]> {
    const query = await this.getScopedQuery(user);

    return query.orderBy('customer.createdAt', 'DESC').getMany();
  }

  async findOne(
    customerId: string,
    user: AuthenticatedUser,
  ): Promise<Customer> {
    const query = await this.getScopedQuery(user);

    const customer = await query
      .andWhere('customer.customerId = :customerId', { customerId })
      .getOne();

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return customer;
  }

  async update(
    customerId: string,
    dto: UpdateCustomerDto,
    user: AuthenticatedUser,
  ): Promise<Customer> {
    this.assertManager(user);

    const customer = await this.findOne(customerId, user);

    Object.assign(customer, dto);

    return this.customerRepository.save(customer);
  }

  async remove(
    customerId: string,
    user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    this.assertManager(user);

    const customer = await this.findOne(customerId, user);

    await this.customerRepository.remove(customer);

    return { message: 'Customer deleted successfully.' };
  }
}
