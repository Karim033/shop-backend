import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'quering/dto/pagination.dto';
import { DefaultPageSize } from 'quering/util/quering.constant';
import { StorageService } from 'files/storage/storage.service';
import { BASE_PATH, FilePath, MaxFileCount } from 'files/util/file.constants';
import { join } from 'path';
import { pathExists } from 'fs-extra';
import { PaginationService } from 'quering/pagination.service';
import { ProductsQueryDto } from './dto/quering/products-query.dto';
import { FilteringService } from 'quering/filtering.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly storageService: StorageService,
    private readonly paginationService: PaginationService,
    private readonly filteringService: FilteringService,
  ) {}
  create(createproductDto: CreateProductDto) {
    const product = this.productRepository.create(createproductDto);
    return this.productRepository.save(product);
  }

  async findAll(@Query() productsQueryDto: ProductsQueryDto) {
    const { page, name, price, categoryId, sort, order } = productsQueryDto;
    const limit = productsQueryDto.limit ?? DefaultPageSize.PRODUCT;
    const offset = this.paginationService.calculateOffset(limit, page);
    const [data, count] = await this.productRepository.findAndCount({
      where: {
        name: this.filteringService.contains(name),
        price,
        categories: {
          id: categoryId,
        },
      },
      order: { [sort]: order },
      skip: offset,
      take: limit,
    });
    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
  }

  async findOne(id: number) {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        categories: true,
      },
    });
  }

  async update(id: number, updateproductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateproductDto,
    });
    if (!product) {
      throw new NotFoundException(`product not found with id: ${id}`);
    }
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    await this.deleteBaseDir(id);
    return product;
  }
  async uploadImages(id: number, files: Express.Multer.File[]) {
    await this.findOne(id);
    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES);
    if (await pathExists(join(BASE_PATH, path))) {
      const incomingFileCount = files.length;
      const dirFileCount = await this.storageService.getDirFileCount(path);
      const totalFileCount = incomingFileCount + dirFileCount;
      this.storageService.validateFileCount(
        totalFileCount,
        MaxFileCount.PRODUCT_IMAGES,
      );
    }
    await this.storageService.createDir(path);
    await Promise.all(
      files.map((file) => this.storageService.saveFile(path, file)),
    );
  }
  async downloadImage(id: number, filename: string) {
    await this.findOne(id);
    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES, filename);
    await this.storageService.validatePath(path);
    return this.storageService.getFile(path);
  }
  async deleteImage(id: number, filename: string) {
    await this.findOne(id);
    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES, filename);
    await this.storageService.validatePath(path);
    return this.storageService.delete(path);
  }
  private async deleteBaseDir(id: number) {
    const { BASE } = FilePath.Products;
    const path = join(BASE, id.toString());
    await this.storageService.delete(path);
  }
}
