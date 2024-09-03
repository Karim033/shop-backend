import { ArrayNotEmpty, IsOptional, Length } from 'class-validator';
import { IsCurrenct } from 'common/decorators/is-currency.decorator';
import { IsEntity } from 'common/decorators/is-entity.decorator';
import { IdDto } from 'common/dto/id.dto';

export class CreateProductDto {
  @Length(2, 50)
  readonly name: string;

  @Length(1, 500)
  @IsOptional()
  readonly description: string;

  @IsCurrenct()
  readonly price: number;

  @ArrayNotEmpty()
  @IsEntity()
  readonly categories: IdDto[];
}
