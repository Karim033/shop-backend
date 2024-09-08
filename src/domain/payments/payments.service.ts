import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'order/entities/order.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { OrderStatus } from 'order/enums/order-status.enum';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { Role } from 'auth/roles/enums/role.enum';
import { compareUserId } from 'auth/util/authorization.util';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async payOrder(id: number, currentUser: RequestUser) {
    const order = await this.orderRepository.findOneOrFail({
      where: { id },
      relations: {
        payment: true,
        customer: true,
      },
    });
    if (currentUser.role !== Role.ADMIN) {
      compareUserId(currentUser.id, order.customer.id);
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
