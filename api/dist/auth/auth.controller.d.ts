import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
interface RequestWithUser {
    user: {
        sub: string;
        phoneOrLogin: string;
    };
}
export declare class AuthController {
    private authService;
    private userRepository;
    constructor(authService: AuthService, userRepository: Repository<User>);
    register(dto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: any;
        accessToken: string;
    }>;
    getMe(req: RequestWithUser): Promise<Omit<User, "passwordHash">>;
    updateMe(dto: UpdateUserDto, req: RequestWithUser): Promise<Omit<User, "passwordHash">>;
    getAllUsers(req: RequestWithUser): Promise<User[]>;
}
export {};
