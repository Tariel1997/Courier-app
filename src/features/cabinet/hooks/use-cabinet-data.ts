import { useLogout } from '@/features/auth/hooks/use-auth-actions'
import { useAccountsStore } from '@/store/accounts.store'
import { useAuthStore } from '@/store/auth.store'
import { useBookingsStore } from '@/store/bookings.store'
import { useEffect } from 'react'

export const useCabinetData = () => {
  const fetchAccounts = useAccountsStore((state) => state.fetchAccounts)
  const fetchBookings = useBookingsStore((state) => state.fetchBookings)
  const accounts = useAccountsStore((state) => state.accounts)
  const accountsStatus = useAccountsStore((state) => state.status)
  const accountsError = useAccountsStore((state) => state.error)
  const bookingsStatus = useBookingsStore((state) => state.status)
  const bookingsError = useBookingsStore((state) => state.error)
  const sessionUser = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useLogout()

  useEffect(() => {
    void fetchAccounts()
    void fetchBookings()
  }, [fetchAccounts, fetchBookings])

  useEffect(() => {
    if (accountsStatus !== 'ready' || !sessionUser) return

    const fresh = accounts.find((account) => account.id === sessionUser.id)
    if (!fresh) {
      void logout()
      return
    }
    if (JSON.stringify(fresh) !== JSON.stringify(sessionUser)) setUser(fresh)
  }, [accounts, accountsStatus, sessionUser, setUser, logout])

  const statuses = [accountsStatus, bookingsStatus]

  return {
    isLoading: statuses.some((status) => status === 'idle' || status === 'loading'),
    error: accountsError ?? bookingsError,
  }
}
