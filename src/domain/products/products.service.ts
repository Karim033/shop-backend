import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'common/util/common.constant';
import { StorageService } from 'files/storage/storage.service';
import { BASE_PATH, FilePath, MaxFileCount } from 'files/util/file.constants';
import { join } from 'path';
import { pathExists } from 'fs-extra';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly storageService: StorageService,
  ) {}
  create(createproductDto: CreateProductDto) {
    const product = this.productRepository.create(createproductDto);
    return this.productRepository.save(product);
  }

  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.productRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.CATEGORY,
    });
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
