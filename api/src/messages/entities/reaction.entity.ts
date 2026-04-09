import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Message } from '../message.entity';
import { User } from '../../auth/user.entity';

@Entity('reactions')
@Index(['messageId'])
@Index(['userId'])
@Unique(['messageId', 'userId']) // Один пользователь - одна реакция на сообщение
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  messageId: string;

  @ManyToOne(() => Message, (message) => message.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Эмодзи (сохраняем как строку, например "❤️" или код "heart")
  @Column({ type: 'varchar', length: 50 })
  emoji: string;

  @CreateDateColumn()
  createdAt: Date;
}
