import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FilesModule } from 'files/files.module';
import { ProductsSubscriber } from './subscribers/product.subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsSubscriber],
})
export class ProductsModule {}
