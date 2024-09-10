import { ApiProperty } from '@nestjs/swagger';

export const apiFilesProperty = () =>
  ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  });
