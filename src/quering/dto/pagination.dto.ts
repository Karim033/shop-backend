import { IsOptional, Max } from 'class-validator';
import { IsCadinal } from 'common/decorators/validators/is-cardinal.decorator';
import { MAX_PAGE_NUMBER, MAX_PAGE_SIZE } from 'quering/util/quering.constant';

export class PaginationDto {
  @IsOptional()
  @Max(MAX_PAGE_SIZE)
  @IsCadinal()
  readonly limit?: number;

  @IsOptional()
  @Max(MAX_PAGE_NUMBER)
  @IsCadinal()
  readonly page?: number = 1;
}
