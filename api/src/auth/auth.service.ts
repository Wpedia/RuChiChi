/* eslint-disable prettier/prettier */

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const existing = await this.userRepository.findOne({
      where: { phoneOrLogin: dto.phoneOrLogin },
    });
    if (existing) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      phoneOrLogin: dto.phoneOrLogin,
      passwordHash,
      firstName: dto.firstName,
      nativeLanguage: dto.nativeLanguage || 'ru',
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), accessToken: token };
  }
  async getMe(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    return this.sanitizeUser(user);
  }

  async update(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    await this.userRepository.update(userId, {
      firstName: dto.firstName,
      bio: dto.bio,
      nativeLanguage: dto.nativeLanguage,
      learningLanguage: dto.learningLanguage,
    });

    return this.getMe(userId);
  }
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { phoneOrLogin: dto.phoneOrLogin },
    });
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), accessToken: token };
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET не задан в .env');
    }

    return jwt.sign({ sub: user.id, phoneOrLogin: user.phoneOrLogin }, secret, {
      expiresIn: '7d',
    });
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...rest } = user as any;
    return rest;
  }
}
