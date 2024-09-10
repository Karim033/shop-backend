import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { Public } from 'auth/decorators/public.decorator';
import { ROLES } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/roles/enums/role.enum';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  createFileValidators,
  createParseFilePipe,
} from 'files/util/file-validation';
import { IdDto } from 'common/dto/id.dto';
import { IdFilenameDto } from 'files/dto/filename/id-filename.dto';
import {
  MaxFileCount,
  MULTIPART_FORMDATA_KEY,
} from 'files/util/file.constants';
import { FilesSchema } from 'files/swagger/schemas/files.schema';
import { FileSchema } from 'files/swagger/schemas/file.schema';
import { BodyInterceptor } from 'files/interceptors/body/body.interceptor';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ROLES(Role.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ROLES(Role.MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @ROLES(Role.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @ApiConsumes(MULTIPART_FORMDATA_KEY)
  @ApiBody({ type: FilesSchema })
  @ROLES(Role.MANAGER)
  @UseInterceptors(
    FilesInterceptor('files', MaxFileCount.PRODUCT_IMAGES),
    BodyInterceptor,
  )
  @Post(':id/images')
  uploadImages(
    @Param() { id }: IdDto,
    @UploadedFiles(createParseFilePipe('2MB', 'png', 'jpeg'))
    files: Express.Multer.File[],
  ) {
    return this.productsService.uploadImages(id, files);
  }

  @ApiOkResponse({ type: FileSchema })
  @Public()
  @Get(':id/images/:filename')
  downloadImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.downloadImage(id, filename);
  }

  @ROLES(Role.MANAGER)
  @Delete(':id/images/:filename')
  deleteImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productsService.deleteImage(id, filename);
  }
}
