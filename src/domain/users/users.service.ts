import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DefaultPageSize } from 'common/util/common.constant';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { compareUserId } from 'auth/util/authorization.util';
import { Role } from 'auth/roles/enums/role.enum';
import { LoginDto } from 'auth/dto/login.dto';
import { HashingService } from 'auth/hashing/hashing.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.userRepository.find({
      skip: offset,
      take: limit ?? DefaultPageSize.USER,
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: RequestUser,
  ) {
    if (currentUser.role !== Role.ADMIN) {
      compareUserId(currentUser.id, id);
    }
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number, soft: Boolean, currentUser: RequestUser) {
    if (currentUser.role !== Role.ADMIN) {
      compareUserId(currentUser.id, id);
      if (!soft) {
        throw new ForbiddenException('Forbidden resource');
      }
    }
    const user = await this.findOne(id);
    return soft
      ? this.userRepository.softRemove(user)
      : this.userRepository.remove(user);
  }

  async recover(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      withDeleted: true,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const isMatch = await this.hashingService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!user.isDeleted) {
      throw new ConflictException('User not deleted');
    }
    return this.userRepository.recover(user);
  }
}
