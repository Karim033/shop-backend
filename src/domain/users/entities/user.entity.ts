import { Role } from 'auth/roles/enums/role.enum';
import { Exclude } from 'class-transformer';
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
  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'role_enum',
    default: Role.USER,
  })
  role: Role;

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
