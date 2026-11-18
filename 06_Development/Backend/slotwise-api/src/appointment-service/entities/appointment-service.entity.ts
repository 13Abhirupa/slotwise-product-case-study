import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Service } from '../../service/entities/service.entity';

@Entity({ name: 'appointment_service' })
export class AppointmentService {
  @PrimaryGeneratedColumn('uuid', { name: 'appointment_service_id' })
  appointmentServiceId: string;

  @Column({ name: 'appointment_id', type: 'uuid' })
  appointmentId: string;

  @ManyToOne(() => Appointment, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'appointment_id', referencedColumnName: 'appointmentId' })
  appointment: Appointment;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'service_id', referencedColumnName: 'serviceId' })
  service: Service;

  @Column({ name: 'service_price', type: 'decimal', precision: 10, scale: 2 })
  servicePrice: string;

  @Column({ name: 'service_duration_minutes', type: 'integer' })
  serviceDurationMinutes: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
