import { ApiProperty } from '@nestjs/swagger';

export const apiFileProperty = () =>
  ApiProperty({
    type: 'string',
    format: 'binary',
  });
