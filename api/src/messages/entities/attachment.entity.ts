import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Message } from '../message.entity';

export enum AttachmentType {
  IMAGE = 'image',
  VOICE = 'voice',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
}

@Entity('attachments')
@Index(['messageId'])
@Index(['fileKey'])
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  messageId: string;

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  // Тип вложения
  @Column({
    type: 'enum',
    enum: AttachmentType,
  })
  type: AttachmentType;

  // Ключ файла в S3/MinIO (например: "images/2024/04/09/uuid.jpg")
  @Column({ type: 'varchar', length: 500 })
  fileKey: string;

  // URL для доступа (генерируется presigned)
  @Column({ type: 'varchar', length: 1000, nullable: true })
  url?: string;

  // URL превью (для изображений)
  @Column({ type: 'varchar', length: 1000, nullable: true })
  thumbnailUrl?: string;

  // Оригинальное имя файла
  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  // MIME тип
  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  // Размер в байтах
  @Column({ type: 'bigint' })
  size: number;

  // Для голосовых/видео: длительность в секундах
  @Column({ type: 'int', nullable: true })
  duration?: number;

  // Размеры для изображений/видео
  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  // Срок действия presigned URL
  @Column({ type: 'timestamp', nullable: true })
  urlExpiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
