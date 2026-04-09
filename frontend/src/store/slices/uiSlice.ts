import type { StateCreator } from "zustand";

export interface UIState {
  activeUserId: string | null;
  typingUsers: Record<string, string[]>;
}

export interface UIActions {
  setActiveUser: (id: string | null) => void;
  setTypingUsers: (conversationId: string, userIds: string[]) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
}

export type UISlice = UIState & UIActions;

const initialState: UIState = {
  activeUserId: null,
  typingUsers: {},
};

export const createUISlice: StateCreator<UISlice> = (set) => ({
  ...initialState,

  setActiveUser: (id) => set({ activeUserId: id }),

  setTypingUsers: (conversationId, userIds) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: userIds },
    })),

  addTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: [
          ...(state.typingUsers[conversationId] || []),
          userId,
        ],
      },
    })),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter(
          (id) => id !== userId
        ),
      },
    })),
});
