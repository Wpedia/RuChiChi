/* eslint-disable prettier/prettier */
import { IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  phoneOrLogin: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  nativeLanguage?: string;
}