import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'quering/dto/pagination.dto';
import { ProductsFilterDto } from './products-filter.dto';
import { ProductsSortDto } from './products-sort.dto';

export class ProductsQueryDto extends IntersectionType(
  PaginationDto,
  ProductsFilterDto,
  ProductsSortDto,
) {}
