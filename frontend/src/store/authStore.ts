import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

interface User {
  id: string;
  phoneOrLogin: string;
  firstName?: string;
  nativeLanguage: string;
  learningLanguage: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phoneOrLogin: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: {
    phoneOrLogin: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    nativeLanguage?: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phoneOrLogin, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", {
            phoneOrLogin,
            password,
          });
          const { user, accessToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Ошибка входа",
            isLoading: false,
          });
          throw error;
        }
      },
      updateUser: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch("/auth/me", data); // Реальный запрос
          set({ user: response.data, isLoading: false });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Ошибка обновления",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", data);
          const { user, accessToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Ошибка регистрации",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
