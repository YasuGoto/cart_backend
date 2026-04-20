import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  stripePaymentIntentId: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
