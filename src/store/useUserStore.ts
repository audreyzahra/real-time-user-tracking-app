import { create } from 'zustand'
import { User } from '@/utils/simulateUsers'

type State = {
    users: User[]
    setUsers: (u: User[]) => void
    followUserId: string | null
    setFollowUserId: (id: string | null) => void
}

export const useUserStore = create<State>((set) => ({
    users: [],
    setUsers: (u) => set({ users: u }),
    followUserId: null,
    setFollowUserId: (id) => set({ followUserId: id })
}))