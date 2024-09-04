import {
  buildMessage,
  matches,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

const AT_LEAST_ONE_NUMBER_REGEX = /.*[\d].*/;

const AT_LEAST_ONE_NUMBER_KEY = 'atLeastOneNumberLetter';

const atLeastOneNumber = (value: string): boolean => {
  return matches(value, AT_LEAST_ONE_NUMBER_REGEX);
};

export function AtLeastOneNumber(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy({
    name: AT_LEAST_ONE_NUMBER_KEY,
    validator: {
      validate: (value): boolean => atLeastOneNumber(value),
      defaultMessage: buildMessage(
        (eachPrefix) =>
          eachPrefix + '$property must contain at least one number',
        validationOptions,
      ),
    },
  });
}
