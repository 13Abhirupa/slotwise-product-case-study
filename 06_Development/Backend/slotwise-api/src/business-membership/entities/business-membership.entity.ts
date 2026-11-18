import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'business_membership' })
@Unique('UQ_business_membership_business_user', ['businessId', 'userId'])
export class BusinessMembership {
  @PrimaryGeneratedColumn('uuid', { name: 'membership_id' })
  membershipId: string;

  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string;

  @ManyToOne(() => Business, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'business_id', referencedColumnName: 'businessId' })
  business: Business;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User;

  @Column({ name: 'role', type: 'varchar', length: 30 })
  role: string;

  @Column({ name: 'membership_status', type: 'varchar', length: 20 })
  membershipStatus: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
