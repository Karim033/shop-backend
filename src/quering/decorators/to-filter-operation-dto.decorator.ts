import { plainToInstance, Transform } from 'class-transformer';
import { FilterOperationDto } from 'quering/dto/filter-operation.dto';

const toFilterOperationDto = (value: string) => {
  const [operator, concatenatedOperands] = value.split(':');
  const operandsStr = concatenatedOperands
    ? concatenatedOperands.split(',')
    : [];
  const operands = operandsStr.map((operand) => +operand);

  const plainDto = {
    operator,
    operands,
  };
  return plainToInstance(FilterOperationDto, plainDto);
};

export const ToFilterOperationDto = () =>
  Transform(({ value }) => toFilterOperationDto(value));
