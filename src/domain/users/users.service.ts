import {
  ConflictException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'common/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'common/util/common.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.userRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number, soft: Boolean) {
    const user = await this.findOne(id);
    return soft
      ? this.userRepository.softRemove(user)
      : this.userRepository.remove(user);
  }

  async recover(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      withDeleted: true,
    });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    if (!user.isDeleted) {
      throw new ConflictException(`User not Deleted`);
    }
    return this.userRepository.recover(user);
  }
}
