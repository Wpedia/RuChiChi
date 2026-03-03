
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { name: string; username: string; email: string; password: string }) => Promise<void>;
}

// Моковый пользователь для теста
const MOCK_USER: User = {
  id: '1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Имитация API
        console.log('Login:', email, password);
        set({ user: MOCK_USER, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (data) => {
        console.log('Register:', data);
        set({ 
          user: { 
            id: Date.now().toString(), 
            name: data.name,
            username: data.username,
            email: data.email 
          }, 
          isAuthenticated: true 
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);