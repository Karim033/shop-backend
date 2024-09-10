import { Module } from '@nestjs/common';
import { StorageService } from './storage/storage.service';
import { FseService } from './storage/fse.service';
import { APP_FILTER } from '@nestjs/core';
import { FileExceptionFilter } from './exception-filter/file-exception/file-exception.filter';

@Module({
  providers: [
    {
      provide: StorageService,
      useClass: FseService,
    },
    {
      provide: APP_FILTER,
      useClass: FileExceptionFilter,
    },
  ],
  exports: [StorageService],
})
export class FilesModule {}
