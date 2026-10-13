import {
  BOOKING_CONFLICT_MESSAGES,
  findBookingConflict,
  findBookingsOutsideSchedule,
  formatBookingDate,
} from '@/lib/booking-rules'
import { formatHourRange } from '@/lib/schedule'
import type { Booking, BookingInput } from '@/types/booking.types'
import type { WorkingSchedule } from '@/types/user.types'

import {
  createResourceClient,
  type ResourceRecord,
} from '../resource/resource-client'

const bookingsClient = createResourceClient<BookingInput>('courier-bookings')

const MAX_LISTED_BOOKINGS = 3

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
  address: data.address ?? '',
})

export const getBookings = async () => (await bookingsClient.list()).map(toBooking)

export const createBooking = async (input: BookingInput) => {
  const conflict = findBookingConflict(await getBookings(), input)
  if (conflict) throw new Error(BOOKING_CONFLICT_MESSAGES[conflict])

  const [created] = await bookingsClient.create([input])
  return toBooking(created)
}

export const assertScheduleKeepsBookings = async (
  courierId: number,
  schedule: WorkingSchedule,
) => {
  const blocking = findBookingsOutsideSchedule(
    await getBookings(),
    courierId,
    schedule,
  )
  if (blocking.length === 0) return

  const list = blocking
    .slice(0, MAX_LISTED_BOOKINGS)
    .map(
      (booking) =>
        `${formatBookingDate(booking.date)} ${formatHourRange(booking.startHour, booking.endHour)}`,
    )
    .join(', ')
  const more =
    blocking.length > MAX_LISTED_BOOKINGS
      ? ` and ${blocking.length - MAX_LISTED_BOOKINGS} more`
      : ''

  throw new Error(
    `This schedule removes time that users have already booked: ${list}${more}. Keep these hours or cancel the bookings first.`,
  )
}

export const deleteBooking = (id: string) => bookingsClient.remove(id)

export const deleteBookingsOfAccount = async (accountId: number) => {
  const related = (await getBookings()).filter(
    (booking) => booking.userId === accountId || booking.courierId === accountId,
  )
  await Promise.all(related.map((booking) => bookingsClient.remove(booking.id)))
}
