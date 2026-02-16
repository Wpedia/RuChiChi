import { create } from "zustand";
import type { Conversation, Message, User } from "../types";

const MOCK_USERS: User[] = [
  {
    id: "2",
    name: "Li Wei",
    username: "liwei",
    email: "liwei@example.com",
    avatar: null,
    nativeLanguage: "zh",
    learningLanguage: "ru",
    level: "intermediate",
    isOnline: true,
    lastActive: new Date(),
  },
  {
    id: "3",
    name: "Wang Fang",
    username: "wangfang",
    email: "wangfang@example.com",
    avatar: null,
    nativeLanguage: "zh",
    learningLanguage: "ru",
    level: "beginner",
    isOnline: false,
    lastActive: new Date(Date.now() - 3600000), 
  },
  {
    id: "4",
    name: "Zhang Ming",
    username: "zhangming",
    email: "zhangming@example.com",
    avatar: null,
    nativeLanguage: "zh",
    learningLanguage: "ru",
    level: "advanced",
    isOnline: true,
    lastActive: new Date(),
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    participants: [MOCK_USERS[0]],
    lastMessage: {
      id: "m1",
      conversationId: "1",
      senderId: "2",
      content: "Привет! Как дела?",
      originalLanguage: "zh",
      timestamp: new Date(Date.now() - 300000), 
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    participants: [MOCK_USERS[1]],
    lastMessage: {
      id: "m2",
      conversationId: "2",
      senderId: "3",
      content: "你好！你好吗？",
      originalLanguage: "zh",
      timestamp: new Date(Date.now() - 7200000), 
      isRead: false,
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    participants: [MOCK_USERS[2]],
    lastMessage: {
      id: "m3",
      conversationId: "3",
      senderId: "4",
      content: "Спасибо за помощь!",
      originalLanguage: "ru",
      timestamp: new Date(Date.now() - 86400000), 
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 86400000),
  },
];
interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;

  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string) => void;
  receiveMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: "1",
  messages: {
    "1": [],
    "2": [],
    "3": [],
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  sendMessage: (conversationId, content) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: "current-user", // Пока захардкожено
      content,
      originalLanguage: "ru",
      timestamp: new Date(),
      isRead: false,
    };

    set((state) => {
      const newMessages = {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          newMessage,
        ],
      };

      const newConversations = state.conversations
        .map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
            : conv
        )
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        return {
          messages: newMessages,
          conversations: newConversations,
        }
    });
  },

  receiveMessage: (message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [message.conversationId]: [
          ...(state.messages[message.conversationId] || []),
          message,
        ],
      },
    }));
  },
}));
