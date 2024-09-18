import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'products/entities/product.entity';
import { PaginationService } from 'quering/pagination.service';
import { QueringModule } from 'quering/quering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    QueringModule,
  ],
  controllers: [OrderController],
  providers: [OrdersService],
})
export class OrderModule {}
