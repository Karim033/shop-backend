import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Order } from 'order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => RegistryDates, { prefix: false })
  registeryDates: RegistryDates;

  @OneToOne(() => Order, (order) => order.payment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;
}
