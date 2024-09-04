import { IsPositive } from 'class-validator';
import { IsCadinal } from 'common/decorators/validators/is-cardinal.decorator';

export class IdDto {
  @IsCadinal()
  readonly id: number;
}
