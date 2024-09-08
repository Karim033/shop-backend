import { StorageService } from 'files/storage/storage.service';
import { BASE_PATH, FilePath } from 'files/util/file.constants';
import { pathExists } from 'fs-extra';
import { join } from 'path';
import { Product } from 'products/entities/product.entity';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  LoadEvent,
} from 'typeorm';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  async afterLoad(entity: Product) {
    const imagesFilename = await this.getImagesFilename(entity.id);
    entity[this.IMAGES_FILENAMES_KEY] = imagesFilename;
  }
  private readonly IMAGES_FILENAMES_KEY = 'imagesFilename';

  private async getImagesFilename(id: number) {
    const { BASE, IMAGES } = FilePath.Products;
    const path = join(BASE, id.toString(), IMAGES);
    if (!(await pathExists(join(BASE_PATH, path)))) return;

    return this.storageService.getDirFileNames(path);
  }
}
