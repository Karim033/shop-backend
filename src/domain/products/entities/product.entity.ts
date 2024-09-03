import { Category } from 'categories/entities/category.entity';
import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { OrderItem } from 'order/entities/order-item.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @Column(() => RegistryDates, { prefix: false })
  registeryDates: RegistryDates;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @OneToMany(() => OrderItem, (item) => item.product)
  items: OrderItem[];

  get orders() {
    return this.items.map((item) => item.order);
  }
}
