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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./message.entity");
let MessagesService = class MessagesService {
    messageRepository;
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async updateStatus(messageId, status) {
        const updateData = { status };
        if (status === message_entity_1.MessageStatus.READ) {
            updateData.isRead = true;
            updateData.readAt = new Date();
        }
        await this.messageRepository.update(messageId, updateData);
    }
    async markAsRead(messageId) {
        await this.messageRepository.update(messageId, {
            status: message_entity_1.MessageStatus.READ,
            isRead: true,
            readAt: new Date(),
        });
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
        });
        if (!message)
            throw new Error('Message not found');
        return message;
    }
    async createMessage(senderId, receiverId, content) {
        try {
            const message = this.messageRepository.create({
                senderId,
                receiverId,
                content,
                type: message_entity_1.MessageType.TEXT,
                status: message_entity_1.MessageStatus.SENT,
            });
            return await this.messageRepository.save(message);
        }
        catch (error) {
            throw error;
        }
    }
    async getHistory(userId1, userId2, limit = 50, offset = 0) {
        return this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .where('(message.senderId = :id1 AND message.receiverId = :id2) OR (message.senderId = :id2 AND message.receiverId = :id1)', { id1: userId1, id2: userId2 })
            .andWhere('message.isDeleted = false')
            .orderBy('message.createdAt', 'DESC')
            .take(limit)
            .skip(offset)
            .getMany();
    }
    async getUnreadCount(userId) {
        return this.messageRepository.count({
            where: { receiverId: userId, isRead: false, isDeleted: false },
        });
    }
    async getLastMessage(userId1, userId2) {
        return this.messageRepository.findOne({
            where: [
                { senderId: userId1, receiverId: userId2, isDeleted: false },
                { senderId: userId2, receiverId: userId1, isDeleted: false },
            ],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map