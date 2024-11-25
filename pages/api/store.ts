import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      job: null,
      setUser: (user: any) => set({ user }),
      setJob: (job: any) => set({ job }),
      removeUser: () => set({ user: null }),
      removeJob: () => set({ job: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)