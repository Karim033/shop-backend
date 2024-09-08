import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { StorageService } from './storage.service';
import { join } from 'path';
import { BASE_PATH } from 'files/util/file.constants';
import { mkdir, pathExists, readdir, remove, writeFile } from 'fs-extra';
import { createReadStream } from 'fs';

@Injectable()
export class FseService implements StorageService {
  async saveFile(path: string, file: Express.Multer.File) {
    const fullPath = join(BASE_PATH, path, file.originalname);
    await writeFile(fullPath, file.buffer);
  }
  async createDir(path: string) {
    const fullPath = join(BASE_PATH, path);
    await mkdir(fullPath);
  }
  getFile(path: string) {
    const fullPath = join(BASE_PATH, path);
    const stream = createReadStream(fullPath);
    return new StreamableFile(stream);
  }
  getDirFileNames(path: string) {
    const fullPath = join(BASE_PATH, path);
    return readdir(fullPath);
  }
  async getDirFileCount(path: string) {
    const dirFileNames = await this.getDirFileNames(path);
    return dirFileNames.length;
  }
  async delete(path: string) {
    const fullPath = join(BASE_PATH, path);
    await remove(fullPath);
  }
  async validatePath(path: string) {
    const fullPath = join(BASE_PATH, path);
    if (!(await pathExists(fullPath))) {
      throw new NotFoundException('Path not found');
    }
  }
}
