export interface Booking {
  id: string
  courierId: number
  userId: number
  date: string
  startHour: number
  endHour: number
  address: string
  createdAt: string
}

export type BookingInput = Omit<Booking, 'id' | 'createdAt'>

export type BookingSlot = Pick<
  Booking,
  'courierId' | 'userId' | 'date' | 'startHour' | 'endHour'
>
