"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const users_status_service_1 = require("../users/users-status.service");
const message_entity_1 = require("./message.entity");
const jwt = require("jsonwebtoken");
let MessagesGateway = class MessagesGateway {
    messagesService;
    usersStatusService;
    server;
    pingIntervals = new Map();
    constructor(messagesService, usersStatusService) {
        this.messagesService = messagesService;
        this.usersStatusService = usersStatusService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                client.disconnect();
                return;
            }
            const payload = jwt.verify(token, secret);
            client.userId = payload.sub;
            await this.usersStatusService.setOnline(payload.sub);
            client.broadcast.emit('user_online', { userId: payload.sub });
            const pingInterval = setInterval(async () => {
                if (client.userId) {
                    await this.usersStatusService.ping(client.userId);
                }
            }, 30000);
            this.pingIntervals.set(client.id, pingInterval);
            const unreadCount = await this.messagesService.getUnreadCount(payload.sub);
            client.emit('unread_count', { count: unreadCount });
        }
        catch (error) {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const interval = this.pingIntervals.get(client.id);
        if (interval) {
            clearInterval(interval);
            this.pingIntervals.delete(client.id);
        }
        if (client.userId) {
            if (client.userId) {
                setTimeout(async () => {
                    const isStillOnline = await this.usersStatusService.isOnline(client.userId);
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
    async handleMessage(data, client) {
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
            const message = await this.messagesService.createMessage(client.userId, data.receiverId, data.content);
            client.emit('message_sent', {
                message: { ...message, status: message_entity_1.MessageStatus.SENT },
            });
            const receiverSocketId = await this.getSocketIdByUserId(data.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('new_message', {
                    message: { ...message, status: message_entity_1.MessageStatus.DELIVERED },
                });
                await this.messagesService.updateStatus(message.id, message_entity_1.MessageStatus.DELIVERED);
            }
            client.emit('message_delivered', { messageId: message.id });
        }
        catch (error) {
            client.emit('error', { message: 'Failed to send message' });
        }
    }
    async handleHistory(data, client) {
        if (!client.userId) {
            return;
        }
        const limit = data.limit || 50;
        const offset = data.offset || 0;
        const messages = await this.messagesService.getHistory(client.userId, data.userId, limit, offset);
        const messagesWithStatus = messages.map((msg) => ({
            ...msg,
            status: msg.isRead
                ? message_entity_1.MessageStatus.READ
                : msg.senderId === client.userId
                    ? message_entity_1.MessageStatus.DELIVERED
                    : message_entity_1.MessageStatus.SENT,
        }));
        client.emit('message_history', {
            messages: messagesWithStatus.reverse(),
            offset,
            hasMore: messages.length === limit,
        });
    }
    async handleMarkRead(data, client) {
        if (!client.userId)
            return;
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
        }
        catch (error) {
            console.error('Mark read error:', error);
        }
    }
    async handleTypingStart(data, client) {
        if (!client.userId)
            return;
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
    async handleTypingStop(data, client) {
        if (!client.userId)
            return;
        await this.usersStatusService.clearTyping(client.userId, data.conversationId);
        const [userId1, userId2] = data.conversationId.split('_');
        const receiverId = userId1 === client.userId ? userId2 : userId1;
        const receiverSocketId = await this.getSocketIdByUserId(receiverId);
        if (receiverSocketId) {
            this.server
                .to(receiverSocketId)
                .emit('typing', { userId: client.userId, isTyping: false });
        }
    }
    async getSocketIdByUserId(userId) {
        const sockets = await this.server.fetchSockets();
        for (const socket of sockets) {
            const authSocket = socket;
            if (authSocket.userId === userId) {
                return socket.id;
            }
        }
        return null;
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_history'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleHistory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing_start'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing_stop'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleTypingStop", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: 'http://localhost:5173', credentials: true },
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        users_status_service_1.UsersStatusService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map