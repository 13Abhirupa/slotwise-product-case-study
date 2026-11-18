import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'business' })
export class Business {
  @PrimaryGeneratedColumn('uuid', { name: 'business_id' })
  businessId: string;

  @Column({ name: 'business_name', type: 'varchar', length: 150 })
  businessName: string;

  @Column({ name: 'business_type', type: 'varchar', length: 50, nullable: true })
  businessType: string | null;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'timezone', type: 'varchar', length: 50, nullable: true })
  timezone: string | null;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
