import { toDateKey } from '@/lib/booking-rules'
import { formatHour, getWorkingHourSlots } from '@/lib/schedule'
import { cn } from '@/lib/utils'
import type { Booking } from '@/types/booking.types'
import { getFullName, type User } from '@/types/user.types'

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const HOUR_MARKS = [0, 6, 12, 18]

interface CourierTimelineProps {
  couriers: User[]
  bookings: Booking[]
  date: Date
  accountMap: Map<number, User>
  highlightCourierId?: number
}

// One row per courier: day off / working hours / booked hours on the given date
const CourierTimeline = ({
  couriers,
  bookings,
  date,
  accountMap,
  highlightCourierId,
}: CourierTimelineProps) => {
  const dateKey = toDateKey(date)

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <div className="flex min-w-xl flex-col gap-2">
          <div className="grid grid-cols-[9rem_1fr] gap-3 text-[10px] text-muted-foreground">
            <span />
            <div className="relative h-4">
              {HOUR_MARKS.map((hour) => (
                <span
                  key={hour}
                  className="absolute"
                  style={{ left: `${(hour / 24) * 100}%` }}
                >
                  {formatHour(hour)}
                </span>
              ))}
            </div>
          </div>

          {couriers.map((courier) => {
            const workingSlots = new Set(
              getWorkingHourSlots(courier.data?.workingDays, date),
            )
            const dayBookings = bookings.filter(
              (booking) =>
                booking.courierId === courier.id && booking.date === dateKey,
            )
            const bookingAt = (hour: number) =>
              dayBookings.find(
                (booking) => booking.startHour <= hour && hour < booking.endHour,
              )

            return (
              <div
                key={courier.id}
                className="grid grid-cols-[9rem_1fr] items-center gap-3"
              >
                <span
                  className={cn(
                    'truncate text-sm font-medium',
                    courier.id === highlightCourierId
                      ? 'text-primary'
                      : 'text-white',
                  )}
                >
                  {getFullName(courier)}
                  {courier.id === highlightCourierId && ' (you)'}
                </span>
                <div className="grid grid-cols-24 gap-0.5">
                  {HOURS.map((hour) => {
                    const booking = bookingAt(hour)
                    const customer = booking && accountMap.get(booking.userId)
                    const label = booking
                      ? `${formatHour(hour)} — booked${customer ? ` by ${getFullName(customer)}` : ''}${booking.address ? ` · ${booking.address}` : ''}`
                      : workingSlots.has(hour)
                        ? `${formatHour(hour)} — available`
                        : `${formatHour(hour)} — off`

                    return (
                      <span
                        key={hour}
                        title={label}
                        aria-label={label}
                        className={cn(
                          'h-7 rounded-[4px]',
                          booking
                            ? 'bg-primary shadow-[0_0_8px_rgba(0,117,255,0.6)]'
                            : workingSlots.has(hour)
                              ? 'bg-success/25'
                              : 'bg-white/5',
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <Legend className="bg-success/25" label="Working, free" />
        <Legend className="bg-primary" label="Booked" />
        <Legend className="bg-white/5" label="Off" />
      </div>
    </div>
  )
}

const Legend = ({ className, label }: { className: string; label: string }) => (
  <span className="flex items-center gap-2">
    <span className={cn('size-3 rounded-[3px]', className)} />
    {label}
  </span>
)

export default CourierTimeline
