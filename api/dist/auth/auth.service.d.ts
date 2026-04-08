import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(dto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    getMe(userId: string): Promise<Omit<User, 'passwordHash'>>;
    update(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>>;
    login(dto: LoginDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    private generateToken;
    private sanitizeUser;
}
