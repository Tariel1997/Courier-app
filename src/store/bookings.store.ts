import { getErrorMessage } from '@/lib/get-error-message'
import {
  createBooking,
  deleteBooking,
  getBookings,
} from '@/service/bookings/bookings.service'
import type { Booking, BookingInput } from '@/types/booking.types'
import { create } from 'zustand'

import type { LoadStatus } from './store.types'

interface BookingsState {
  bookings: Booking[]
  status: LoadStatus
  error: string | null
  fetchBookings: () => Promise<void>
  book: (input: BookingInput) => Promise<Booking>
  cancel: (bookingId: string) => Promise<void>
  forgetAccount: (accountId: number) => void
  reset: () => void
}

const initialState = {
  bookings: [] as Booking[],
  status: 'idle' as LoadStatus,
  error: null,
}

export const useBookingsStore = create<BookingsState>()((set, get) => ({
  ...initialState,
  reset: () => set(initialState),

  fetchBookings: async () => {
    // Background refreshes keep showing the data that is already loaded
    if (get().status !== 'ready') set({ status: 'loading', error: null })
    try {
      set({ bookings: await getBookings(), status: 'ready' })
    } catch (error) {
      set({
        status: 'error',
        error: getErrorMessage(error, 'Could not load bookings'),
      })
    }
  },

  book: async (input) => {
    try {
      const booking = await createBooking(input)
      set({ bookings: [...get().bookings, booking] })
      return booking
    } catch (error) {
      // Someone may have taken the slot meanwhile — show the latest availability
      void get().fetchBookings()
      throw error
    }
  },

  cancel: async (bookingId) => {
    await deleteBooking(bookingId)
    set({ bookings: get().bookings.filter((booking) => booking.id !== bookingId) })
  },

  // Bookings of a removed account are deleted on the server; mirror it locally
  forgetAccount: (accountId) =>
    set({
      bookings: get().bookings.filter(
        (booking) => booking.userId !== accountId && booking.courierId !== accountId,
      ),
    }),
}))
