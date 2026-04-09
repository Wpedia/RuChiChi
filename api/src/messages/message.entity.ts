import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne, 
  JoinColumn,
  Index,
  OneToMany
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Reaction } from './entities/reaction.entity';
import { Attachment } from './entities/attachment.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  FILE = 'file',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

@Entity('messages')
@Index(['senderId', 'receiverId', 'createdAt'])
@Index(['receiverId', 'isRead'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'uuid' })
  receiverId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.SENT })
  status: MessageStatus;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  attachmentUrl?: string;

  @Column({ type: 'int', nullable: true })
  voiceDuration?: number;

  @Column({ type: 'uuid', nullable: true })
  replyToMessageId?: string;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Reaction, reaction => reaction.message, { cascade: true })
  reactions: Reaction[];

  @OneToMany(() => Attachment, attachment => attachment.message, { cascade: true })
  attachments: Attachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
