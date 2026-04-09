import { create } from "zustand";
import { createMessagesSlice, type MessagesSlice } from "./slices/messagesSlice";
import { createUsersSlice, type UsersSlice } from "./slices/usersSlice";
import { createUISlice, type UISlice } from "./slices/uiSlice";

// Типы
export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "image" | "voice";

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  replyToMessageId?: string;
  reactions?: Reaction[];
  type?: MessageType;
  attachmentUrl?: string;
  attachmentName?: string;
  voiceDuration?: number;
}

export interface User {
  id: string;
  phoneOrLogin: string;
  firstName?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

// Объединенный тип состояния
type ChatStore = MessagesSlice & UsersSlice & UISlice;

// Основной store
export const useChatStore = create<ChatStore>()((...args) => ({
  ...createMessagesSlice(...args),
  ...createUsersSlice(...args),
  ...createUISlice(...args),
}));

// Экспорты для удобного доступа к отдельным slices
import { shallow } from 'zustand/shallow';

export const useMessagesStore = () => useChatStore(
  (state) => ({
    messages: state.messages,
    unreadCounts: state.unreadCounts,
    messagesOffset: state.messagesOffset,
    hasMoreMessages: state.hasMoreMessages,
  }),
  shallow
);

export const useUsersStore = () => useChatStore((state) => ({
  users: state.users,
  setUsers: state.setUsers,
  updateUserStatus: state.updateUserStatus,
}));

export const useUIStore = () => useChatStore((state) => ({
  activeUserId: state.activeUserId,
  typingUsers: state.typingUsers,
  setActiveUser: state.setActiveUser,
  setTypingUsers: state.setTypingUsers,
  addTypingUser: state.addTypingUser,
  removeTypingUser: state.removeTypingUser,
}));
