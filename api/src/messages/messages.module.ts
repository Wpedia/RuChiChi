import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { RedisModule } from '../redis/redis.module';
import { UsersStatusService } from '../users/users-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), RedisModule],
  providers: [MessagesService, MessagesGateway, UsersStatusService],
  exports: [MessagesService],
})
export class MessagesModule {}