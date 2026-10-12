// A user's booking of a courier for a continuous range of whole hours on a date
export interface Booking {
  id: string
  courierId: number
  userId: number
  // ISO calendar date, e.g. "2026-10-08"
  date: string
  // Hour range [startHour, endHour), e.g. 9 → 11 means 09:00 – 11:00
  startHour: number
  endHour: number
  // Where the courier should come — the user's address at booking time
  address: string
  createdAt: string
}

export type BookingInput = Omit<Booking, 'id' | 'createdAt'>

// The part of a booking that decides whether it overlaps with others
export type BookingSlot = Pick<
  Booking,
  'courierId' | 'userId' | 'date' | 'startHour' | 'endHour'
>
