import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState & UserActions>()(
  immer((set) => ({
    // State
    user: null,
    isLoading: false,
    error: null,

    // Actions
    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.error = null;
      }),

    clearUser: () =>
      set((state) => {
        state.user = null;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
        state.isLoading = false;
      }),
  }))
);