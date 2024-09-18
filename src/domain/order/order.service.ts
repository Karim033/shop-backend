import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DefaultPageSize } from 'common/util/common.constant';
import { OrderITemDto } from './dto/order-item.dto';
import { Product } from 'products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createorderDto: CreateOrderDto) {
    const { items } = createorderDto;

    const itemWithPrice = await Promise.all(
      items.map((item) => this.createOrderItemWithPrice(item)),
    );

    const order = this.orderRepository.create({
      ...createorderDto,
      items: itemWithPrice,
    });
    return this.orderRepository.save(order);
  }

  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.orderRepository.find({
      skip: offset,
      take: limit ?? DefaultPageSize.CATEGORY,
    });
  }

  async findOne(id: number) {
    return this.orderRepository.findOneOrFail({
      where: { id },
      relations: {
        items: {
          product: true,
        },
        customer: true,
        payment: true,
      },
    });
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepository.remove(order);
  }

  private async createOrderItemWithPrice(orderItemDto: OrderITemDto) {
    const { id } = orderItemDto.product;
    const { price } = await this.productRepository.findOneByOrFail({ id });

    const orderItem = this.orderItemRepository.create({
      ...orderItemDto,
      price,
    });
    return orderItem;
  }
}
