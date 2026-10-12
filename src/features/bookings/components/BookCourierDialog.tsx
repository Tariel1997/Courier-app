import { fieldControlClassName } from '@/components/form/controls/field-styles'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addressField } from '@/features/auth/fields/user-fields'
import { getSlotStatus, toDateKey } from '@/lib/booking-rules'
import { getErrorMessage } from '@/lib/get-error-message'
import { formatHourRange, getWorkingHourSlots, isWorkingDate } from '@/lib/schedule'
import { useAuthStore } from '@/store/auth.store'
import { useBookingsStore } from '@/store/bookings.store'
import { getFullName, type User } from '@/types/user.types'
import { addMonths, format, startOfDay } from 'date-fns'
import { CalendarCheckIcon, ClockIcon, Loader2Icon, MapPinIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import HourSlotPicker, { type HourRange } from './HourSlotPicker'

interface BookCourierDialogProps {
  courier: User
}

const BOOKING_WINDOW_MONTHS = 2

const BookCourierDialog = ({ courier }: BookCourierDialogProps) => {
  const userId = useAuthStore((state) => state.user?.id)
  const profileAddress = useAuthStore((state) => state.user?.data?.address ?? '')
  const bookings = useBookingsStore((state) => state.bookings)
  const book = useBookingsStore((state) => state.book)

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>()
  const [range, setRange] = useState<HourRange | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [address, setAddress] = useState(profileAddress)

  const schedule = courier.data?.workingDays
  // Same rules as the address field of the registration form
  const addressCheck = addressField.schema.safeParse(address)
  const addressError = addressCheck.success
    ? null
    : addressCheck.error.issues[0]?.message
  const today = startOfDay(new Date())

  const slots = useMemo(() => {
    if (!date || !userId) return []
    const dateKey = toDateKey(date)

    return getWorkingHourSlots(schedule, date).map((hour) => ({
      hour,
      status: getSlotStatus(bookings, {
        courierId: courier.id,
        userId,
        date: dateKey,
        hour,
      }),
    }))
  }, [bookings, courier.id, date, schedule, userId])

  const resetSelection = () => {
    setRange(null)
    setError(null)
    setSuccess(null)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setDate(undefined)
      setAddress(profileAddress)
      resetSelection()
    }
  }

  const handleBook = async () => {
    if (!date || !range || !userId || !addressCheck.success) return
    setIsPending(true)
    setError(null)
    try {
      await book({
        courierId: courier.id,
        userId,
        date: toDateKey(date),
        ...range,
        address: String(addressCheck.data),
      })
      setSuccess(
        `Booked for ${format(date, 'EEE, d MMM')} · ${formatHourRange(range.startHour, range.endHour)}`,
      )
      setRange(null)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not book the courier'))
      setRange(null)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-primary text-xs font-bold hover:bg-primary/85"
      >
        <CalendarCheckIcon /> Book courier
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="glass-card max-h-[calc(100svh-2rem)] overflow-y-auto bg-[#0b1033] text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              Book {getFullName(courier)}
            </DialogTitle>
            <DialogDescription>
              Pick a working day, then one or more consecutive free hours. Hours that
              are already taken are disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(next) => {
                setDate(next)
                resetSelection()
              }}
              weekStartsOn={1}
              startMonth={today}
              endMonth={addMonths(today, BOOKING_WINDOW_MONTHS)}
              disabled={[
                { before: today },
                { after: addMonths(today, BOOKING_WINDOW_MONTHS) },
                (day) => !isWorkingDate(schedule, day),
              ]}
              className="mx-auto rounded-2xl border border-white/5 bg-field [--cell-size:--spacing(9)]"
            />

            <div className="flex min-w-0 flex-col gap-4">
              {!date ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
                  <ClockIcon className="size-8 text-primary" />
                  Select a highlighted day in the calendar to see free hours.
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-white">
                    {format(date, 'EEEE, d MMMM')}
                  </p>
                  <HourSlotPicker slots={slots} value={range} onChange={setRange} />
                  {slots.length > 0 &&
                    slots.every((slot) => slot.status !== 'free') && (
                      <p className="text-sm text-muted-foreground">
                        No free hours left on this day.
                      </p>
                    )}
                </>
              )}

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`booking-address-${courier.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  <MapPinIcon className="size-4 text-primary" /> Pick-up address
                </Label>
                <Textarea
                  id={`booking-address-${courier.id}`}
                  rows={2}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="City, street, building, apartment"
                  aria-invalid={!!addressError}
                  className={`${fieldControlClassName} h-auto min-h-16 py-3`}
                />
                <p
                  className={
                    addressError
                      ? 'text-xs text-destructive'
                      : 'text-xs text-muted-foreground'
                  }
                >
                  {addressError ?? 'The courier will see this address'}
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-success">{success}</p>}

              <Button
                disabled={!range || !!addressError || isPending}
                onClick={handleBook}
                className="mt-auto h-11 rounded-2xl text-xs font-bold tracking-wider uppercase"
              >
                {isPending && <Loader2Icon className="animate-spin" />}
                {range
                  ? `Book ${formatHourRange(range.startHour, range.endHour)}`
                  : 'Select hours'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BookCourierDialog
