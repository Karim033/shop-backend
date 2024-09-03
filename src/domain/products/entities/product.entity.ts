import { Category } from 'categories/entities/category.entity';
import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
