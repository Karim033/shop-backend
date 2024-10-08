import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { OrderModule } from './domain/order/order.module';
import { PaymentsModule } from './domain/payments/payments.module';
import { CategoriesModule } from './domain/categories/categories.module';
import { ProductsModule } from './domain/products/products.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { QueringModule } from './quering/quering.module';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    DatabaseModule,
    EnvModule,
    OrderModule,
    PaymentsModule,
    CategoriesModule,
    ProductsModule,
    AuthModule,
    FilesModule,
    QueringModule,
  ],
})
export class AppModule {}
