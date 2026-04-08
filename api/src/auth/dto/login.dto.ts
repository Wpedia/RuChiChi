import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  phoneOrLogin: string;

  @IsString()
  password: string;
}