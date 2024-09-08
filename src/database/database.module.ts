import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './exception-filters/not-found-exception/not-found-exception.filter';
import { DatabaseExceptionFilter } from './exception-filters/database-exception/database-exception.filter';

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig.asProvider())],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class DatabaseModule {}
