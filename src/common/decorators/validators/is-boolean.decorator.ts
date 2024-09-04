import { applyDecorators } from '@nestjs/common';
import {
  IsBoolean as DefaultIsBoolean,
  ValidationOptions,
} from 'class-validator';
import { ToBoolean } from '../transformers/to-boolean.decorators';

/**
 * Checks if the value is a Boolean works with query params.
 */
export const IsBoolean = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(DefaultIsBoolean(validationOptions), ToBoolean());
