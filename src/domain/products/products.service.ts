import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'common/util/common.constant';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createproductDto: CreateProductDto) {
    const product = this.productRepository.create(createproductDto);
    return this.productRepository.save(product);
  }

  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.productRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.CATEGORY,
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`product not found with id: ${id}`);
    }
    return product;
  }

  async update(id: number, updateproductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateproductDto,
    });
    if (!product) {
      throw new NotFoundException(`product not found with id: ${id}`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}
