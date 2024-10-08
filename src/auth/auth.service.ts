import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RoleDto } from './roles/dto/role.dto';
import { Role } from './roles/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLocal(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const isMatch = await this.hashingService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.createRequestUser(user);
  }

  async validateJwt(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.createRequestUser(user);
  }

  login(user: RequestUser) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

  getProfile(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async assignRole(id: number, role: Role) {
    const user = await this.userRepository.preload({ id, role });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.userRepository.save(user);
  }

  private createRequestUser(user: User): RequestUser {
    const { id, role } = user;
    return { id, role };
  }
}
