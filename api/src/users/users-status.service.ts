import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class UsersStatusService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setOnline(userId: string): Promise<void> {
    await this.redis.setex(`user:${userId}:online`, 120, '1');
    await this.redis.set(`user:${userId}:lastSeen`, Date.now());
  }

  async ping(userId: string): Promise<void> {
    await this.redis.expire(`user:${userId}:online`, 120);
  }

  async isOnline(userId: string): Promise<boolean> {
    const exists = await this.redis.exists(`user:${userId}:online`);
    return exists === 1;
  }

  async getLastSeen(userId: string): Promise<number | null> {
    const lastSeen = await this.redis.get(`user:${userId}:lastSeen`);
    return lastSeen ? parseInt(lastSeen) : null;
  }

  async setTyping(userId: string, conversationId: string): Promise<void> {
    await this.redis.setex(`typing:${conversationId}:${userId}`, 5, '1');
  }

  async clearTyping(userId: string, conversationId: string): Promise<void> {
    await this.redis.del(`typing:${conversationId}:${userId}`);
  }

  async getTypingUsers(conversationId: string): Promise<string[]> {
    const keys = await this.redis.keys(`typing:${conversationId}:*`);
    return keys.map(key => key.split(':')[2]);
  }
}