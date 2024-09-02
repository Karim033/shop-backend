import { IsOptional } from 'class-validator';
import { IsCadinal } from 'common/decorators/is-cardinal.decorator';

export class PaginationDto {
  @IsOptional()
  @IsCadinal()
  readonly offset: number;

  @IsOptional()
  @IsCadinal()
  readonly limit: number;
}
