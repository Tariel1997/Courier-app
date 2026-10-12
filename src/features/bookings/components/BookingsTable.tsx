import ConfirmButton from '@/components/dashboard/ConfirmButton'
import EmptyState from '@/components/dashboard/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBookingDate, isUpcoming } from '@/lib/booking-rules'
import { formatHourRange } from '@/lib/schedule'
import { cn } from '@/lib/utils'
import { useBookingsStore } from '@/store/bookings.store'
import type { Booking } from '@/types/booking.types'
import { getFullName, type User } from '@/types/user.types'
import { CalendarXIcon, MapPinIcon, XIcon } from 'lucide-react'

interface BookingsTableProps {
  bookings: Booking[]
  accountMap: Map<number, User>
  // Which side of the booking to show — the other one is the current viewer
  show: ('courier' | 'user')[]
  canCancel?: boolean
  emptyText?: string
}

const BookingsTable = ({
  bookings,
  accountMap,
  show,
  canCancel = false,
  emptyText = 'No bookings yet',
}: BookingsTableProps) => {
  const cancel = useBookingsStore((state) => state.cancel)

  if (bookings.length === 0)
    return <EmptyState icon={CalendarXIcon} title={emptyText} />

  const nameOf = (id: number) => {
    const account = accountMap.get(id)
    return account ? getFullName(account) : 'Removed account'
  }

  // Older bookings have no address of their own — fall back to the customer's profile
  const addressOf = (booking: Booking) =>
    booking.address || accountMap.get(booking.userId)?.data?.address || '—'

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-2xl">
        <TableHeader>
          <TableRow className="border-white/10 text-[11px] tracking-wider uppercase hover:bg-transparent">
            {show.includes('courier') && (
              <TableHead className="text-muted-foreground">Courier</TableHead>
            )}
            {show.includes('user') && (
              <TableHead className="text-muted-foreground">Customer</TableHead>
            )}
            <TableHead className="text-muted-foreground">Address</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Time</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            {canCancel && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const upcoming = isUpcoming(booking)

            return (
              <TableRow key={booking.id} className="border-white/5">
                {show.includes('courier') && (
                  <TableCell className="font-medium text-white">
                    {nameOf(booking.courierId)}
                  </TableCell>
                )}
                {show.includes('user') && (
                  <TableCell className="font-medium text-white">
                    {nameOf(booking.userId)}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {accountMap.get(booking.userId)?.email}
                    </span>
                  </TableCell>
                )}
                <TableCell>
                  <span className="flex max-w-64 items-start gap-1.5 text-sm whitespace-normal text-white">
                    <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {addressOf(booking)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatBookingDate(booking.date)}
                </TableCell>
                <TableCell className="text-white">
                  {formatHourRange(booking.startHour, booking.endHour)}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'rounded-lg px-2 py-1 text-xs font-semibold',
                      upcoming
                        ? 'bg-primary/20 text-primary'
                        : 'bg-success/15 text-success',
                    )}
                  >
                    {upcoming ? 'Upcoming' : 'Completed'}
                  </span>
                </TableCell>
                {canCancel && (
                  <TableCell className="text-right">
                    {upcoming && (
                      <ConfirmButton
                        label="Cancel"
                        icon={XIcon}
                        title="Cancel this booking?"
                        description={`${nameOf(booking.courierId)} · ${formatBookingDate(booking.date)} · ${formatHourRange(booking.startHour, booking.endHour)}. The time slot becomes free for other users.`}
                        confirmLabel="Cancel booking"
                        onConfirm={() => cancel(booking.id)}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default BookingsTable
