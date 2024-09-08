import {
  ConflictException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { join } from 'path';
import { BASE_PATH } from 'files/util/file.constants';
import { mkdirp, pathExists, readdir, remove, writeFile } from 'fs-extra';
import { createReadStream } from 'fs';

@Injectable()
export class FseService implements StorageService {
  async saveFile(path: string, file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const uniqueFileName = this.getUniqueFileName(originalname);
    const fullPath = join(BASE_PATH, path, uniqueFileName);
    await writeFile(fullPath, buffer);
  }
  async createDir(path: string) {
    const fullPath = join(BASE_PATH, path);
    await mkdirp(fullPath);
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

  validateFileCount(count: number, max: number) {
    if (count > max) {
      throw new ConflictException('File count exceeds max limit ');
    }
  }
  getUniqueFileName(fileName: string) {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniquePrefix}-${fileName}`;
  }
}
