// types/index.ts

export type Language = 'ru' | 'zh';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string | null;
  nativeLanguage: Language;
  learningLanguage: Language;
  level: Level;
  isOnline?: boolean;
  lastActive?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User; // Вложенный объект для отображения
  content: string;
  translatedContent?: string;
  originalLanguage: Language;
  timestamp: Date;
  isRead: boolean;
}

// Для отправки нового сообщения (без id и timestamp)
export interface NewMessage {
  conversationId: string;
  content: string;
  originalLanguage: Language;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}