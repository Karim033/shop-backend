import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'auth/auth.module';
import { UserSubscriber } from './subscribers/users.subscribers';
import { PaginationService } from 'quering/pagination.service';
import { QueringModule } from 'quering/quering.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, QueringModule],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
})
export class UsersModule {}
