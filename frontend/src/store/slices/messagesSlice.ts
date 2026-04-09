import type { StateCreator } from "zustand";
import type { Message, MessageStatus, Reaction } from "../chatStore";

export interface MessagesState {
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  messagesOffset: Record<string, number>;
  hasMoreMessages: Record<string, boolean>;
}

export interface MessagesActions {
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus, readAt?: string) => void;
  setMessages: (currentUserId: string, userId: string, messages: Message[], reset?: boolean) => void;
  prependMessages: (currentUserId: string, userId: string, messages: Message[]) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, userId: string) => void;
  setUnreadCount: (userId: string, count: number) => void;
}

export type MessagesSlice = MessagesState & MessagesActions;

const initialState: MessagesState = {
  messages: {},
  unreadCounts: {},
  messagesOffset: {},
  hasMoreMessages: {},
};

export const createMessagesSlice: StateCreator<MessagesSlice> = (set) => ({
  ...initialState,

  addMessage: (message) =>
    set((state) => {
      const conversationId = [message.senderId, message.receiverId].sort().join("_");
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
      };
    }),

  updateMessageStatus: (messageId, status, readAt) =>
    set((state) => {
      const newMessages = { ...state.messages };
      Object.keys(newMessages).forEach((convId) => {
        newMessages[convId] = newMessages[convId].map((msg) =>
          msg.id === messageId
            ? { ...msg, status, readAt: readAt || msg.readAt }
            : msg
        );
      });
      return { messages: newMessages };
    }),

  setMessages: (currentUserId, userId, messages, reset = true) =>
    set((state) => {
      const conversationId = [currentUserId, userId].sort().join("_");
      const limit = 50;
      return {
        messages: {
          ...state.messages,
          [conversationId]: reset ? messages : [...(state.messages[conversationId] || []), ...messages],
        },
        messagesOffset: {
          ...state.messagesOffset,
          [conversationId]: messages.length,
        },
        hasMoreMessages: {
          ...state.hasMoreMessages,
          [conversationId]: messages.length === limit,
        },
      };
    }),

  prependMessages: (currentUserId, userId, messages) =>
    set((state) => {
      const conversationId = [currentUserId, userId].sort().join("_");
      const currentOffset = state.messagesOffset[conversationId] || 0;
      const limit = 50;
      const existingMessages = state.messages[conversationId] || [];
      
      // Фильтруем дубликаты по ID
      const existingIds = new Set(existingMessages.map(m => m.id));
      const uniqueNewMessages = messages.filter(m => !existingIds.has(m.id));
      
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...uniqueNewMessages, ...existingMessages],
        },
        messagesOffset: {
          ...state.messagesOffset,
          [conversationId]: currentOffset + uniqueNewMessages.length,
        },
        hasMoreMessages: {
          ...state.hasMoreMessages,
          [conversationId]: messages.length === limit,
        },
      };
    }),

  addReaction: (messageId, emoji, userId) =>
    set((state) => {
      const newMessages = { ...state.messages };
      Object.keys(newMessages).forEach((convId) => {
        newMessages[convId] = newMessages[convId].map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const filtered = reactions.filter((r) => r.userId !== userId);
            return { ...msg, reactions: [...filtered, { emoji, userId }] };
          }
          return msg;
        });
      });
      return { messages: newMessages };
    }),

  removeReaction: (messageId, userId) =>
    set((state) => {
      const newMessages = { ...state.messages };
      Object.keys(newMessages).forEach((convId) => {
        newMessages[convId] = newMessages[convId].map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            return { ...msg, reactions: reactions.filter((r) => r.userId !== userId) };
          }
          return msg;
        });
      });
      return { messages: newMessages };
    }),

  setUnreadCount: (userId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [userId]: count },
    })),
});
