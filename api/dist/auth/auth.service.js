"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user_entity_1 = require("./user.entity");
let AuthService = class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('Пароли не совпадают');
        }
        const existing = await this.userRepository.findOne({
            where: { phoneOrLogin: dto.phoneOrLogin },
        });
        if (existing) {
            throw new common_1.BadRequestException('Пользователь уже существует');
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
    async getMe(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Пользователь не найден');
        return this.sanitizeUser(user);
    }
    async update(userId, dto) {
        await this.userRepository.update(userId, {
            firstName: dto.firstName,
            bio: dto.bio,
            nativeLanguage: dto.nativeLanguage,
            learningLanguage: dto.learningLanguage,
        });
        return this.getMe(userId);
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { phoneOrLogin: dto.phoneOrLogin },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Неверный логин или пароль');
        }
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Неверный логин или пароль');
        }
        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), accessToken: token };
    }
    generateToken(user) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET не задан в .env');
        }
        return jwt.sign({ sub: user.id, phoneOrLogin: user.phoneOrLogin }, secret, {
            expiresIn: '7d',
        });
    }
    sanitizeUser(user) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map