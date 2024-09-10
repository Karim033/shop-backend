import { apiFileProperty } from '../decorators/api-file-property.decorator';

export class FileSchema {
  @apiFileProperty()
  file: Express.Multer.File;
}
