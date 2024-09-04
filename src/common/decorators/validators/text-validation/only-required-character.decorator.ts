import {
  buildMessage,
  matches,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

const ONLY_REQUIRED_CHARACTER_REGEX = /^[a-zA-Z\d@$!%*?&]+$/;

const ONLY_REQUIRED_CHARACTER_KEY = 'onlyRequiredCharacters';

const onlyRequiredCharacters = (value: string): boolean => {
  return matches(value, ONLY_REQUIRED_CHARACTER_REGEX);
};

export function OnlyRequiredCharacters(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy({
    name: ONLY_REQUIRED_CHARACTER_KEY,
    validator: {
      validate: (value): boolean => onlyRequiredCharacters(value),
      defaultMessage: buildMessage(
        (eachPrefix) =>
          eachPrefix +
          '$property must contain only letters , number and the following special characters @$!%*?&',
        validationOptions,
      ),
    },
  });
}
