import { User } from '../auth/user.entity';
export declare class Message {
    id: string;
    senderId: string;
    sender: User;
    receiverId: string;
    content: string;
    isRead: boolean;
    replyToMessageId?: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
