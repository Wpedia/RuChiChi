import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UsersStatusService } from '../users/users-status.service';
interface AuthSocket extends Socket {
    userId?: string;
}
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messagesService;
    private usersStatusService;
    server: Server;
    private pingIntervals;
    constructor(messagesService: MessagesService, usersStatusService: UsersStatusService);
    handleConnection(client: AuthSocket): Promise<void>;
    handleDisconnect(client: AuthSocket): Promise<void>;
    handleMessage(data: {
        receiverId: string;
        content: string;
        replyToId?: string;
    }, client: AuthSocket): Promise<boolean | undefined>;
    handleHistory(data: {
        userId: string;
        limit?: number;
        offset?: number;
    }, client: AuthSocket): Promise<void>;
    handleMarkRead(data: {
        messageId: string;
    }, client: AuthSocket): Promise<void>;
    handleTypingStart(data: {
        conversationId: string;
    }, client: AuthSocket): Promise<void>;
    handleTypingStop(data: {
        conversationId: string;
    }, client: AuthSocket): Promise<void>;
    private getSocketIdByUserId;
}
export {};
