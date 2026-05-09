import { createStore } from 'zustand/vanilla';
export type AuthState = { token: string | null; setToken: (token: string | null) => void };
export const createAuthStore = (init: string | null = null) => createStore<AuthState>((set) => ({ token: init, setToken: (token) => set({ token }) }));
