import { LOCALSTORAGE_KEYS } from '@/config'
import type { User } from '@/types/user.types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null }),
    }),
    {
      name: LOCALSTORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
