import { IsIn, IsNumber } from 'class-validator';
import { ValidateFilterLengthOperands } from 'quering/decorators/validate-filter-length-operands';

const Operator = ['lt', 'lte', 'gt', 'gte', 'eq', 'btw'] as const;
type Operator = (typeof Operator)[number];

export class FilterOperationDto {
  @IsIn(Operator)
  readonly operator: Operator;

  @IsNumber({}, { each: true })
  readonly operands: number[];

  @ValidateFilterLengthOperands()
  private readonly manyFieldValidation: any;
}
