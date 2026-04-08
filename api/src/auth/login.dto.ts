/* eslint-disable prettier/prettier */
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  phoneOrLogin: string;

  @IsString()
  @MinLength(6)
  password: string;
}
