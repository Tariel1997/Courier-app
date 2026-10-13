import { getWeekDay, getWorkingHourSlots } from '@/lib/schedule'
import type { Booking, BookingSlot } from '@/types/booking.types'
import type { WeekDay, WorkingSchedule } from '@/types/user.types'
import { format, isToday, parseISO, startOfDay } from 'date-fns'

export const DATE_FORMAT = 'yyyy-MM-dd'

export const toDateKey = (date: Date) => format(date, DATE_FORMAT)

export const formatBookingDate = (dateKey: string) =>
  format(parseISO(dateKey), 'EEE, d MMM yyyy')

const rangesOverlap = (
  a: Pick<Booking, 'startHour' | 'endHour'>,
  b: Pick<Booking, 'startHour' | 'endHour'>,
) => a.startHour < b.endHour && b.startHour < a.endHour

export type BookingConflict = 'courier-busy' | 'user-busy'

export const BOOKING_CONFLICT_MESSAGES: Record<BookingConflict, string> = {
  'courier-busy': 'This courier is already booked for the selected time',
  'user-busy': 'You already have another courier booked at this time',
}

export const findBookingConflict = (
  bookings: Booking[],
  input: BookingSlot,
): BookingConflict | null => {
  const sameDay = bookings.filter(
    (booking) => booking.date === input.date && rangesOverlap(booking, input),
  )

  if (sameDay.some((booking) => booking.courierId === input.courierId))
    return 'courier-busy'
  if (sameDay.some((booking) => booking.userId === input.userId)) return 'user-busy'
  return null
}

export type SlotStatus = 'free' | 'past' | 'courier-busy' | 'user-busy'

export const getSlotStatus = (
  bookings: Booking[],
  {
    courierId,
    userId,
    date,
    hour,
  }: Omit<BookingSlot, 'startHour' | 'endHour'> & {
    hour: number
  },
  now = new Date(),
): SlotStatus => {
  const dateValue = parseISO(date)
  if (dateValue < startOfDay(now) || (isToday(dateValue) && hour <= now.getHours()))
    return 'past'

  return (
    findBookingConflict(bookings, {
      courierId,
      userId,
      date,
      startHour: hour,
      endHour: hour + 1,
    }) ?? 'free'
  )
}

export const isUpcoming = (booking: Booking, now = new Date()) => {
  const date = parseISO(booking.date)
  if (isToday(date)) return booking.endHour > now.getHours()
  return date > now
}

export const findBookingsOutsideSchedule = (
  bookings: Booking[],
  courierId: number,
  schedule: WorkingSchedule,
  now = new Date(),
) =>
  sortBookings(
    bookings.filter((booking) => {
      if (booking.courierId !== courierId || !isUpcoming(booking, now)) return false
      const slots = getWorkingHourSlots(schedule, parseISO(booking.date))
      return (
        !slots.includes(booking.startHour) || !slots.includes(booking.endHour - 1)
      )
    }),
  )

export const getBookedWeekDays = (
  bookings: Booking[],
  courierId: number,
  now = new Date(),
): WeekDay[] => [
  ...new Set(
    bookings
      .filter(
        (booking) => booking.courierId === courierId && isUpcoming(booking, now),
      )
      .map((booking) => getWeekDay(parseISO(booking.date))),
  ),
]

export const sortBookings = (bookings: Booking[]) =>
  [...bookings].sort(
    (a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour,
  )

export const countDistinctUsers = (bookings: Booking[]) =>
  new Set(bookings.map((booking) => booking.userId)).size
