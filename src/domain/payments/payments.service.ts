import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'order/entities/order.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { OrderStatus } from 'order/enums/order-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async payOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        payment: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`order not found with id: ${id}`);
    }
    if (order.payment) {
      throw new NotFoundException(`order already paid with id: ${id}`);
    }
    const payment = this.paymentRepository.create();
    order.payment = payment;
    order.status = OrderStatus.AWAITING_SHIPMENT;
    return this.orderRepository.save(order);
  }
}
