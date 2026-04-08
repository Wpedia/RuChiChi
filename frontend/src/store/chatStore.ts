import { create } from "zustand";
import type { Message, User } from "../types";
import { useAuthStore } from "./authStore";

interface ChatState {
  users: User[];                   
  messages: Record<string, Message[]>; 
  activeUserId: string | null;     
  unreadCounts: Record<string, number>;
  
  setUsers: (users: User[]) => void;
  setActiveUser: (id: string | null) => void;
  addMessage: (msg: Message) => void;
  setMessages: (userId: string, msgs: Message[]) => void;
  setUnreadCount: (userId: string, count: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  users: [],
  messages: {},
  activeUserId: null,
  unreadCounts: {},
  
  setUsers: (users) => set({ users }),
  
  setActiveUser: (id) => set({ activeUserId: id }),
  
  addMessage: (msg) => {
    const currentUserId = useAuthStore.getState().user?.id;
    // Определяем с кем диалог (другой пользователь)
    const otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    
    set((state) => ({
      messages: {
        ...state.messages,
        [otherId]: [...(state.messages[otherId] || []), msg],
      },
    }));
  },
  
  setMessages: (userId, msgs) => set((state) => ({
    messages: { ...state.messages, [userId]: msgs },
  })),
  
  setUnreadCount: (userId, count) => set((state) => ({
    unreadCounts: { ...state.unreadCounts, [userId]: count },
  })),
}));