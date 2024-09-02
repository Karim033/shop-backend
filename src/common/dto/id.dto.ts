import { IsPositive } from 'class-validator';
import { IsCadinal } from 'common/decorators/is-cardinal.decorator';

export class IdDto {
  @IsCadinal()
  readonly id: number;
}
