import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdDto } from '../../common/dto/id.dto';
import { PaginationDto } from 'quering/dto/pagination.dto';
import { RemoveDto } from 'common/dto/remove.dto';
import { Public } from 'auth/decorators/public.decorator';
import { ROLES } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/roles/enums/role.enum';
import { User } from 'auth/decorators/user.decorator';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { LoginDto } from 'auth/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ROLES(Role.MANAGER)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }
  @ROLES(Role.MANAGER)
  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }
  @Public()
  @Patch('recover')
  recover(@Body() loginDto: LoginDto) {
    return this.usersService.recover(loginDto);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdDto,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: RequestUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  remove(
    @Param() { id }: IdDto,
    @Query() { soft }: RemoveDto,
    @User() user: RequestUser,
  ) {
    return this.usersService.remove(id, soft, user);
  }
}
