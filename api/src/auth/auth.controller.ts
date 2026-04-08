import { Controller, Post, Patch, Get, Body, UseGuards, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from './jwt.guard';
import { User } from './user.entity';

interface RequestWithUser {
  user: {
    sub: string;
    phoneOrLogin: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return this.authService.getMe(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(@Body() dto: UpdateUserDto, @Req() req: RequestWithUser) {
    return this.authService.update(req.user.sub, dto);
  }

  @UseGuards(JwtGuard)
  @Get('users')
  async getAllUsers(@Req() req: RequestWithUser) {
    return this.userRepository.find({
      select: ['id', 'phoneOrLogin', 'firstName', 'nativeLanguage', 'learningLanguage', 'createdAt'],
      where: { id: Not(req.user.sub) },
    });
  }
}