import { sortBookings } from '@/lib/booking-rules'
import { useAccountsStore } from '@/store/accounts.store'
import { useBookingsStore } from '@/store/bookings.store'
import { ROLES, type Role, type User } from '@/types/user.types'
import { useMemo } from 'react'

export const useAccountsByRole = (role: Role) => {
  const accounts = useAccountsStore((state) => state.accounts)
  return useMemo(
    () => accounts.filter((account) => account.role === role),
    [accounts, role],
  )
}

export const useCouriers = () => useAccountsByRole(ROLES.COURIER)

export const useAccountMap = () => {
  const accounts = useAccountsStore((state) => state.accounts)
  return useMemo(
    () => new Map<number, User>(accounts.map((account) => [account.id, account])),
    [accounts],
  )
}

export const useSortedBookings = () => {
  const bookings = useBookingsStore((state) => state.bookings)
  return useMemo(() => sortBookings(bookings), [bookings])
}
