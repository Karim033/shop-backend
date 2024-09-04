import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Order } from 'order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column({
    unique: true,
  })
  phone: string;
  @Column()
  password: string;

  @Column(() => RegistryDates, {
    prefix: false,
  })
  registryDates: RegistryDates;

  get isDeleted() {
    return !!this.registryDates.deletatedAt;
  }

  @OneToMany(() => Order, (order) => order.customer, {
    cascade: ['soft-remove', 'recover'],
  })
  orders: Order[];
}
