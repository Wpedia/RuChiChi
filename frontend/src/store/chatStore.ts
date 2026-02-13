import { create } from 'zustand';
import type { Conversation, Message } from '../types';


interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string) => void;
  receiveMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  sendMessage: (conversationId, content) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: 'current-user', // Пока захардкожено
      content,
      originalLanguage: 'ru',
      timestamp: new Date(),
      isRead: false,
    };
    
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
    }));
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