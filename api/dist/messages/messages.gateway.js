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
const jwt = require("jsonwebtoken");
let MessagesGateway = class MessagesGateway {
    messagesService;
    server;
    userSockets = new Map();
    constructor(messagesService) {
        this.messagesService = messagesService;
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
                console.error('JWT_SECRET not set');
                client.disconnect();
                return;
            }
            const payload = jwt.verify(token, secret);
            client.userId = payload.sub;
            this.userSockets.set(payload.sub, client.id);
            console.log(`User ${payload.sub} connected`);
            const unreadCount = await this.messagesService.getUnreadCount(payload.sub);
            client.emit('unread_count', { count: unreadCount });
        }
        catch (error) {
            console.error('Connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.userSockets.delete(client.userId);
            console.log(`User ${client.userId} disconnected`);
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
            client.emit('message_sent', { message });
            const receiverSocketId = this.userSockets.get(data.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('new_message', { message });
            }
        }
        catch (error) {
            console.error('Send message error:', error);
            client.emit('error', { message: 'Failed to send message' });
        }
    }
    async handleHistory(data, client) {
        if (!client.userId)
            return;
        const messages = await this.messagesService.getHistory(client.userId, data.userId, data.limit, data.offset);
        client.emit('message_history', { messages: messages.reverse() });
    }
    async handleMarkRead(data, client) {
        await this.messagesService.markAsRead(data.messageId);
        client.emit('message_read', { messageId: data.messageId });
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
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        },
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map