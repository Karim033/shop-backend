import {
  ConflictException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'quering/dto/pagination.dto';
import { DefaultPageSize } from 'quering/util/quering.constant';
import { PaginationService } from 'quering/pagination.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly paginationService: PaginationService,
  ) {}

  create(createcategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createcategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(@Query() paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.PRODUCT;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.categoryRepository.findAndCount({
      skip: offset,
      take: limit ?? DefaultPageSize.CATEGORY,
    });
    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
  }

  async findOne(id: number) {
    return this.categoryRepository.findOneOrFail({
      where: { id },
      relations: {
        products: true,
      },
    });
  }

  async update(id: number, updatecategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updatecategoryDto,
    });
    if (!category) {
      throw new NotFoundException(`category not found with id: ${id}`);
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.products.length) {
      throw new ConflictException('Category has related products');
    }
    return this.categoryRepository.remove(category);
  }
}
