import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = this.messageRepository.create({ senderId, receiverId, content });
    return this.messageRepository.save(message);
  }

  async getHistory(userId1: string, userId2: string, limit = 50, offset = 0): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender') 
      .where(
        '(message.senderId = :id1 AND message.receiverId = :id2) OR (message.senderId = :id2 AND message.receiverId = :id1)',
        { id1: userId1, id2: userId2 }
      )
      .andWhere('message.isDeleted = false')
      .orderBy('message.createdAt', 'DESC')
      .take(limit)
      .skip(offset) // ← Для "загрузить еще"
      .getMany();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false, isDeleted: false },
    });
  }

  async getLastMessage(userId1: string, userId2: string): Promise<Message | null> {
    return this.messageRepository.findOne({
      where: [
        { senderId: userId1, receiverId: userId2, isDeleted: false },
        { senderId: userId2, receiverId: userId1, isDeleted: false },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.messageRepository.update(messageId, { isRead: true });
  }
}