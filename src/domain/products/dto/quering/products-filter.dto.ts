import { IsOptional } from 'class-validator';
import { IsCadinal } from 'common/decorators/validators/is-cardinal.decorator';
import { IsCurrency } from 'common/decorators/validators/is-currency.decorator';
import { NameFilterDto } from 'quering/dto/name-filter.dto';

export class ProductsFilterDto extends NameFilterDto {
  @IsOptional()
  @IsCurrency()
  readonly price?: number;
  @IsOptional()
  @IsCadinal()
  readonly categoryId?: number;
}
