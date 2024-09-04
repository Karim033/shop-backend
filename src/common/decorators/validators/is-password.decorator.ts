import { applyDecorators } from '@nestjs/common';
import { Length, ValidationOptions } from 'class-validator';
import { AtLeastOneLowercaseLetter } from './text-validation/at-least-one-lowercase.decorator';
import { AtLeastOneUppercaseLetter } from './text-validation/at-least-one-uppercase.decorator';
import { OnlyRequiredCharacters } from './text-validation/only-required-character.decorator';
import { AtLeastOneSpecialCharacterLetter } from './text-validation/at-least-one-special-character.decorator';
import { AtLeastOneNumber } from './text-validation/at-least-one-number.decorator';

/**
 * Check if value is a string following these rules:
 * 1. 8 to 20 characters
 * 2. At least one
 * - Lowercase letter
 * -Uppercase letter
 * -Number
 * -Special character
 */

export const IsPassword = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(
    AtLeastOneLowercaseLetter(validationOptions),
    AtLeastOneUppercaseLetter(validationOptions),
    OnlyRequiredCharacters(validationOptions),
    AtLeastOneSpecialCharacterLetter(validationOptions),
    AtLeastOneNumber(validationOptions),
    Length(8, 20, validationOptions),
  );
