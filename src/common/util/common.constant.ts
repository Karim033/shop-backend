import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export const DefaultPageSize = {
  USER: 10,
  ORDERS: 5,
  CATEGORY: 30,
  PRODUCT: 20,
} as const satisfies Record<string, number>;
