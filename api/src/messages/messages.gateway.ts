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
import * as jwt from 'jsonwebtoken';

interface AuthSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
  namespace: 'chat',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Храним кто онлайн: userId -> socketId
  private userSockets = new Map<string, string>();

  constructor(private messagesService: MessagesService) {}

  // Подключение клиента
  async handleConnection(client: AuthSocket) {
    try {
      const token = client.handshake.auth.token as string;
      if (!token) {
        client.disconnect();
        return;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET not set');
        client.disconnect();
        return;
      }
      const payload = jwt.verify(token, secret) as any;
      client.userId = payload.sub;
      this.userSockets.set(payload.sub, client.id);

      console.log(`User ${payload.sub} connected`);

      // Отправляем количество непрочитанных
      const unreadCount = await this.messagesService.getUnreadCount(
        payload.sub,
      );
      client.emit('unread_count', { count: unreadCount });
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  // Отключение клиента
  handleDisconnect(client: AuthSocket) {
    if (client.userId) {
      this.userSockets.delete(client.userId);
      console.log(`User ${client.userId} disconnected`);
    }
  }

  // Отправка сообщения
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { receiverId: string; content: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) {
      return client.emit('error', { message: 'Not authenticated' });
    }

    // Валидация
    if (!data.content?.trim()) {
      return client.emit('error', { message: 'Empty message' });
    }
    
    if (data.receiverId === client.userId) {
      return client.emit('error', { message: 'Cannot message yourself' });
    }

    try {
      // Сохраняем в БД
      const message = await this.messagesService.createMessage(
        client.userId,
        data.receiverId,
        data.content,
      );

      // Отправляем отправителю (подтверждение)
      client.emit('message_sent', { message });

      // Отправляем получателю (если онлайн)
      const receiverSocketId = this.userSockets.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', { message });
      }
    } catch (error) {
      console.error('Send message error:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  // Получение истории
  @SubscribeMessage('get_history')
  async handleHistory(
    @MessageBody() data: { userId: string; limit?: number; offset?: number },
    @ConnectedSocket() client: AuthSocket,
  ) {
    if (!client.userId) return;

    const messages = await this.messagesService.getHistory(
      client.userId,
      data.userId,
      data.limit,
      data.offset,
    );

    client.emit('message_history', { messages: messages.reverse() });
  }

  // Отметить прочитанным
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    await this.messagesService.markAsRead(data.messageId);
    client.emit('message_read', { messageId: data.messageId });
  }
}