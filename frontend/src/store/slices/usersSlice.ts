import type { StateCreator } from "zustand";
import type { User } from "../chatStore";

export interface UsersState {
  users: User[];
}

export interface UsersActions {
  setUsers: (users: User[]) => void;
  updateUserStatus: (userId: string, isOnline: boolean, lastSeen?: number) => void;
}

export type UsersSlice = UsersState & UsersActions;

const initialState: UsersState = {
  users: [],
};

export const createUsersSlice: StateCreator<UsersSlice> = (set) => ({
  ...initialState,

  setUsers: (users) => set({ users }),

  updateUserStatus: (userId, isOnline, lastSeen) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? { ...u, isOnline, lastSeen: lastSeen || u.lastSeen }
          : u
      ),
    })),
});
