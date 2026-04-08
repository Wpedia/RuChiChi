import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
interface AuthSocket extends Socket {
    userId?: string;
}
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messagesService;
    server: Server;
    private userSockets;
    constructor(messagesService: MessagesService);
    handleConnection(client: AuthSocket): Promise<void>;
    handleDisconnect(client: AuthSocket): void;
    handleMessage(data: {
        receiverId: string;
        content: string;
    }, client: AuthSocket): Promise<boolean | undefined>;
    handleHistory(data: {
        userId: string;
        limit?: number;
        offset?: number;
    }, client: AuthSocket): Promise<void>;
    handleMarkRead(data: {
        messageId: string;
    }, client: AuthSocket): Promise<void>;
}
export {};
