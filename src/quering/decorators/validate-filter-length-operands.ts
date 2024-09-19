import { ValidateBy, ValidationArguments } from 'class-validator';
import { FilterOperationDto } from 'quering/dto/filter-operation.dto';

const VALIDATE_FILTER_LENGTH_OPERAND_KEY = 'validateFilterLengthOperands';

const validateFilterLengthOperands = (args: ValidationArguments) => {
  const filterOperationDto = args.object as FilterOperationDto;
  const { operator, operands } = filterOperationDto;
  switch (operator) {
    case 'lt':
    case 'lte':
    case 'gt':
    case 'gte':
    case 'eq':
      return operands.length === 1;
    case 'btw':
      return operands.length === 2;
    default:
      const exhuastiveCheck: never = operator;
      return exhuastiveCheck;
  }
};

export const ValidateFilterLengthOperands = (): PropertyDecorator => {
  return ValidateBy({
    name: VALIDATE_FILTER_LENGTH_OPERAND_KEY,
    validator: {
      validate: (value, args): boolean => validateFilterLengthOperands(args),
      defaultMessage: () =>
        'Operands length is not according to filter operator',
    },
  });
};
