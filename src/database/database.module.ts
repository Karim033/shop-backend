import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingModule } from './seeding/seeding.module';
import databaseConfig from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './exception-filters/not-found-exception/not-found-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    SeedingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class DatabaseModule {}
