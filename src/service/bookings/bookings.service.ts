import { BOOKING_CONFLICT_MESSAGES, findBookingConflict } from '@/lib/booking-rules'
import type { Booking, BookingInput } from '@/types/booking.types'

import {
  createResourceClient,
  type ResourceRecord,
} from '../resource/resource-client'

const bookingsClient = createResourceClient<BookingInput>('courier-bookings')

const toBooking = ({
  id,
  data,
  createdAt,
}: ResourceRecord<BookingInput>): Booking => ({
  id,
  createdAt,
  courierId: Number(data.courierId),
  userId: Number(data.userId),
  date: data.date,
  startHour: Number(data.startHour),
  endHour: Number(data.endHour),
  // Bookings created before addresses were introduced have none
  address: data.address ?? '',
})

export const getBookings = async () => (await bookingsClient.list()).map(toBooking)

export const createBooking = async (input: BookingInput) => {
  // Re-check against the freshest data right before saving
  const conflict = findBookingConflict(await getBookings(), input)
  if (conflict) throw new Error(BOOKING_CONFLICT_MESSAGES[conflict])

  const [created] = await bookingsClient.create([input])
  return toBooking(created)
}

export const deleteBooking = (id: string) => bookingsClient.remove(id)

export const deleteBookingsOfAccount = async (accountId: number) => {
  const related = (await getBookings()).filter(
    (booking) => booking.userId === accountId || booking.courierId === accountId,
  )
  await Promise.all(related.map((booking) => bookingsClient.remove(booking.id)))
}
