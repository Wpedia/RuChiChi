import { Repository } from 'typeorm';
import { Message } from './message.entity';
export declare class MessagesService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    createMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
    getHistory(userId1: string, userId2: string, limit?: number, offset?: number): Promise<Message[]>;
    getUnreadCount(userId: string): Promise<number>;
    getLastMessage(userId1: string, userId2: string): Promise<Message | null>;
    markAsRead(messageId: string): Promise<void>;
}
