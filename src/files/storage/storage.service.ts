import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export abstract class StorageService {
  abstract saveFile(path: string, file: Express.Multer.File): Promise<void>;
  abstract createDir(path: string): Promise<void>;
  abstract getFile(path: string): StreamableFile;
  abstract getDirFileNames(path: string): Promise<string[]>;
  abstract getDirFileCount(path: string): Promise<number>;
  abstract delete(path: string): Promise<void>;
  abstract validatePath(path: string): Promise<void>;
}
