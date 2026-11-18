import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { Service } from '../../service/entities/service.entity';

@Entity({ name: 'staff_service' })
@Unique('UQ_staff_service_staff_service', ['staffId', 'serviceId'])
export class StaffService {
  @PrimaryGeneratedColumn('uuid', { name: 'staff_service_id' })
  staffServiceId: string;

  @Column({ name: 'staff_id', type: 'uuid' })
  staffId: string;

  @ManyToOne(() => Staff, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'staffId' })
  staff: Staff;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'service_id', referencedColumnName: 'serviceId' })
  service: Service;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
