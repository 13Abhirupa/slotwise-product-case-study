import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const appointment = await this.appointmentRepository.findOneBy({
      appointmentId: dto.appointmentId,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    this.validateAmount(dto.amount);

    const payment = this.paymentRepository.create({
      appointmentId: dto.appointmentId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentStatus,
      transactionReference: dto.transactionReference ?? null,
      paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll() {
    return this.paymentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOneBy({
      paymentId: id,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    return payment;
  }

  async findByAppointment(appointmentId: string) {
    const appointment = await this.appointmentRepository.findOneBy({
      appointmentId,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    return this.paymentRepository.findBy({ appointmentId });
  }

  async update(id: string, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (dto.amount !== undefined) {
      this.validateAmount(dto.amount);
    }

    Object.assign(payment, dto);

    if (dto.paymentDate !== undefined) {
      payment.paymentDate = dto.paymentDate
        ? new Date(dto.paymentDate)
        : null;
    }

    return this.paymentRepository.save(payment);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);

    await this.paymentRepository.remove(payment);

    return {
      message: 'Payment deleted successfully.',
    };
  }

  private validateAmount(amount: string) {
    if (Number(amount) < 0) {
      throw new BadRequestException(
        'Payment amount cannot be negative.',
      );
    }
  }
}
