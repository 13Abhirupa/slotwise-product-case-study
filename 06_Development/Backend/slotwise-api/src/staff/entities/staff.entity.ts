import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { BusinessMembership } from '../../business-membership/entities/business-membership.entity';

@Entity({ name: 'staff' })
export class Staff {
  @PrimaryGeneratedColumn('uuid', { name: 'staff_id' })
  staffId: string;

  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string;

  @ManyToOne(() => Business, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'business_id', referencedColumnName: 'businessId' })
  business: Business;

  @Column({ name: 'membership_id', type: 'uuid', nullable: true })
  membershipId: string | null;

  @ManyToOne(() => BusinessMembership, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'membership_id', referencedColumnName: 'membershipId' })
  membership: BusinessMembership | null;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'employment_status', type: 'varchar', length: 20 })
  employmentStatus: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
