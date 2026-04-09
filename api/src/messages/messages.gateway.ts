import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesService } from './messages.service';
import { UsersStatusService } from '../users/users-status.service';
import { Message, MessageStatus } from './message.entity';
import * as jwt from 'jsonwebtoken';

interface AuthSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
  namespace: 'chat',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  
  @WebSocketServer()
  server: Server;


  private pingIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private messagesService: MessagesService,
    private usersStatusService: UsersStatusService,
  ) {}

  async handleConnection(client: AuthSocket) {
    try {
      const token = client.handshake.auth.token as string;
      if (!token) {
        client.disconnect();
        return;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, secret) as any;
      client.userId = payload.sub;

      await this.usersStatusService.setOnline(payload.sub);
      client.broadcast.emit('user_online', { userId: payload.sub });

      const pingInterval = setInterval(async () => {
        if (client.userId) {
          await this.usersStatusService.ping(client.userId);
        }
      }, 30000);

      this.pingIntervals.set(client.id, pingInterval);

      const unreadCount = await this.messagesService.getUnreadCount(
        payload.sub,
      );
      client.emit('unread_count', { count: unreadCount });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthSocket) {
    const interval = this.pingIntervals.get(client.id);
    if (interval) {
      clearInterval(interval);
      this.pingIntervals.delete(client.id);
    }

    if (client.userId) {
      if (client.userId) {
        setTimeout(async () => {
          const isStillOnline = await this.usersStatusService.isOnline(
            client.userId!,
          );
          if (!isStillOnline) {
            this.server.emit('user_offline', {
              userId: client.userId,
              lastSeen: Date.now(),
            });
          }
        }, 2000);
      }
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: { receiverId: string; content: string; replyToId?: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) {
      return client.emit('error', { message: 'Not authenticated' });
    }

    if (!data.content?.trim()) {
      return client.emit('error', { message: 'Empty message' });
    }

    if (data.receiverId === client.userId) {
      return client.emit('error', { message: 'Cannot message yourself' });
    }

    try {
      const message = await this.messagesService.createMessage(
        client.userId,
        data.receiverId,
        data.content,
      );

      client.emit('message_sent', {
        message: { ...message, status: MessageStatus.SENT },
      });

      const receiverSocketId = await this.getSocketIdByUserId(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', {
          message: { ...message, status: MessageStatus.DELIVERED },
        });
        await this.messagesService.updateStatus(
          message.id,
          MessageStatus.DELIVERED,
        );
      }

      client.emit('message_delivered', { messageId: message.id });
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('get_history')
  async handleHistory(
    @MessageBody() data: { userId: string; limit?: number; offset?: number },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) {
      return;
    }

    const limit = data.limit || 50;
    const offset = data.offset || 0;

    const messages = await this.messagesService.getHistory(
      client.userId,
      data.userId,
      limit,
      offset,
    );



    const messagesWithStatus = messages.map((msg: Message) => ({
      ...msg,
      status: msg.isRead
        ? MessageStatus.READ
        : msg.senderId === client.userId
          ? MessageStatus.DELIVERED
          : MessageStatus.SENT,
    }));

    client.emit('message_history', { 
      messages: messagesWithStatus.reverse(),
      offset,
      hasMore: messages.length === limit,
    });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) return;

    try {
      const message = await this.messagesService.markAsRead(data.messageId);

      const senderSocketId = await this.getSocketIdByUserId(message.senderId);
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('message_read', {
          messageId: data.messageId,
          readAt: new Date(),
        });
      }

      client.emit('message_read_confirmed', { messageId: data.messageId });
    } catch (error) {
      console.error('Mark read error:', error);
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) return;

    await this.usersStatusService.setTyping(client.userId, data.conversationId);

    const [userId1, userId2] = data.conversationId.split('_');
    const receiverId = userId1 === client.userId ? userId2 : userId1;

    const receiverSocketId = await this.getSocketIdByUserId(receiverId);
    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit('typing', { userId: client.userId, isTyping: true });
    }
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) return;

    await this.usersStatusService.clearTyping(
      client.userId,
      data.conversationId,
    );

    const [userId1, userId2] = data.conversationId.split('_');
    const receiverId = userId1 === client.userId ? userId2 : userId1;

    const receiverSocketId = await this.getSocketIdByUserId(receiverId);
    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit('typing', { userId: client.userId, isTyping: false });
    }
  }

  private async getSocketIdByUserId(userId: string): Promise<string | null> {
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      const authSocket = socket as unknown as AuthSocket;
      if (authSocket.userId === userId) {
        return socket.id;
      }
    }
    return null;
  }
}
