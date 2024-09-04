import {
  buildMessage,
  matches,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

const PAASWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,20}$/;

const IS_PASSWORD_KEY = 'isPassword';

function isPassword(value: string): boolean {
  return matches(value, PAASWORD_REGEX);
}

/**
 * Check if value is a string following these rules:
 * 1. 8 to 20 characters
 * 2. At least one
 * - Lowercase letter
 * -Uppercase letter
 * -Number
 * -Special character
 */

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy({
    name: IS_PASSWORD_KEY,
    validator: {
      validate: (value): boolean => isPassword(value),
      defaultMessage: buildMessage(
        (eachPrefix) => eachPrefix + '$property must be a valid password',
        validationOptions,
      ),
    },
  });
}
