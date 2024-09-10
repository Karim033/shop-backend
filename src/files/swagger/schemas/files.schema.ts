import { apiFilesProperty } from '../decorators/api-files-property.decorator';

export class FilesSchema {
  @apiFilesProperty()
  files: Express.Multer.File[];
}
