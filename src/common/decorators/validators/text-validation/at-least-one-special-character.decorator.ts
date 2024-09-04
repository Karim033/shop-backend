import {
  buildMessage,
  matches,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

const AT_LEAST_ONE_SPECIAL_CHARACTER_REGEX = /.*[@$!%*?&].*/;

const AT_LEAST_ONE_SPECIAL_CHARACTER_KEY = 'atLeastOneSpecialCharacterLetter';

const atLeastOneSpecialCharacterLetter = (value: string): boolean => {
  return matches(value, AT_LEAST_ONE_SPECIAL_CHARACTER_REGEX);
};

export function AtLeastOneSpecialCharacterLetter(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy({
    name: AT_LEAST_ONE_SPECIAL_CHARACTER_KEY,
    validator: {
      validate: (value): boolean => atLeastOneSpecialCharacterLetter(value),
      defaultMessage: buildMessage(
        (eachPrefix) =>
          eachPrefix + '$property must contain at least one special character',
        validationOptions,
      ),
    },
  });
}
