import { IsIn, IsOptional, IsString } from 'class-validator';
import { OrderDto } from 'quering/dto/order.dto';

const Sort = ['price', 'name'] as const;
type Sort = (typeof Sort)[number];

export class ProductsSortDto extends OrderDto {
  @IsOptional()
  @IsIn(Sort)
  readonly sort?: Sort = 'name';
}
