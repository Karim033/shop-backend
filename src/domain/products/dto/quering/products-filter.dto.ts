import { IsOptional, ValidateNested } from 'class-validator';
import { IsCadinal } from 'common/decorators/validators/is-cardinal.decorator';
import { ToFilterOperationDto } from 'quering/decorators/to-filter-operation-dto.decorator';
import { FilterOperationDto } from 'quering/dto/filter-operation.dto';
import { NameFilterDto } from 'quering/dto/name-filter.dto';

export class ProductsFilterDto extends NameFilterDto {
  @IsOptional()
  @ValidateNested()
  @ToFilterOperationDto()
  readonly price?: FilterOperationDto;

  @IsOptional()
  @IsCadinal()
  readonly categoryId?: number;
}
