import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'quering/dto/pagination.dto';
import { DefaultPageSize } from 'quering/util/quering.constant';
import { OrderITemDto } from './dto/order-item.dto';
import { Product } from 'products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaginationService } from 'quering/pagination.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly paginationService: PaginationService,
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

  async findAll(@Query() paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.ORDERS;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.orderRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
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
