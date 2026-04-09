import { User } from '../auth/user.entity';
import { Reaction } from './entities/reaction.entity';
import { Attachment } from './entities/attachment.entity';
export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    VOICE = "voice",
    FILE = "file"
}
export declare enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}
export declare class Message {
    id: string;
    senderId: string;
    sender: User;
    receiverId: string;
    content: string;
    type: MessageType;
    status: MessageStatus;
    isRead: boolean;
    readAt: Date;
    attachmentUrl?: string;
    voiceDuration?: number;
    replyToMessageId?: string;
    isDeleted: boolean;
    reactions: Reaction[];
    attachments: Attachment[];
    createdAt: Date;
    updatedAt: Date;
}
