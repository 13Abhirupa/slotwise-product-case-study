import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';

@Entity({ name: 'availability_exception' })
export class AvailabilityException {
  @PrimaryGeneratedColumn('uuid', { name: 'exception_id' })
  exceptionId: string;

  @Column({ name: 'staff_id', type: 'uuid' })
  staffId: string;

  @ManyToOne(() => Staff, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'staffId' })
  staff: Staff;

  @Column({ name: 'exception_date', type: 'date' })
  exceptionDate: string;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;

  @Column({ name: 'exception_type', type: 'varchar', length: 30 })
  exceptionType: string;

  @Column({ name: 'reason', type: 'varchar', length: 255 })
  reason: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
