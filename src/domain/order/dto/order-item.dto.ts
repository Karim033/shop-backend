import { IsCadinal } from 'common/decorators/is-cardinal.decorator';
import { IsEntity } from 'common/decorators/is-entity.decorator';
import { IdDto } from 'common/dto/id.dto';

export class OrderITemDto {
  @IsEntity()
  readonly product: IdDto;

  @IsCadinal()
  readonly quantity: number;
}
