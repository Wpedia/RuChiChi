/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'), // Явный путь к .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        console.log('=== DB CONFIG ===');
        console.log('Host:', config.get('DB_HOST'));
        console.log('User:', config.get('DB_USER'));
        console.log('DB:', config.get('DB_NAME'));
        return {
          type: 'postgres',
          host: config.get('DB_HOST', 'localhost'),
          port: parseInt(config.get('DB_PORT', '5432')),
          username: config.get('DB_USER', 'postgres'),
          password: config.get('DB_PASSWORD', 'postgres'),
          database: config.get('DB_NAME', 'chat'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    MessagesModule
  ],
})
export class AppModule {}
