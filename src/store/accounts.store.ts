import { getErrorMessage } from '@/lib/get-error-message'
import type { RegisterPayload } from '@/service/auth/auth.types'
import { deleteBookingsOfAccount } from '@/service/bookings/bookings.service'
import {
  applyProfileOverride,
  saveProfileOverride,
  type ProfilePatch,
} from '@/service/profiles/profiles.service'
import createAccountRequest from '@/service/users/create-account'
import getAccounts from '@/service/users/get-accounts'
import type { User } from '@/types/user.types'
import { create } from 'zustand'

import type { LoadStatus } from './store.types'

interface AccountsState {
  accounts: User[]
  status: LoadStatus
  error: string | null
  fetchAccounts: () => Promise<void>
  createAccount: (payload: RegisterPayload) => Promise<User>
  updateAccount: (userId: number, patch: ProfilePatch) => Promise<User>
  deleteAccount: (userId: number) => Promise<void>
  reset: () => void
}

const initialState = {
  accounts: [] as User[],
  status: 'idle' as LoadStatus,
  error: null,
}

export const useAccountsStore = create<AccountsState>()((set, get) => ({
  ...initialState,
  reset: () => set(initialState),

  fetchAccounts: async () => {
    if (get().status !== 'ready') set({ status: 'loading', error: null })
    try {
      set({ accounts: await getAccounts(), status: 'ready' })
    } catch (error) {
      set({
        status: 'error',
        error: getErrorMessage(error, 'Could not load accounts'),
      })
    }
  },

  createAccount: async (payload) => {
    const account = await createAccountRequest(payload)
    set({ accounts: [...get().accounts, account] })
    return account
  },

  updateAccount: async (userId, patch) => {
    const override = await saveProfileOverride(userId, patch)
    const current = get().accounts.find((account) => account.id === userId)
    if (!current) throw new Error('Account not found')

    const updated = applyProfileOverride(current, { ...override, data: patch.data })
    set({
      accounts: get().accounts.map((account) =>
        account.id === userId ? updated : account,
      ),
    })
    return updated
  },

  deleteAccount: async (userId) => {
    await saveProfileOverride(userId, { deleted: true })
    await deleteBookingsOfAccount(userId)
    set({ accounts: get().accounts.filter((account) => account.id !== userId) })
  },
}))
