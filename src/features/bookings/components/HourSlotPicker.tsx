import type { SlotStatus } from '@/lib/booking-rules'
import { formatHour } from '@/lib/schedule'
import { cn } from '@/lib/utils'

export interface HourRange {
  startHour: number
  endHour: number
}

interface HourSlotPickerProps {
  slots: { hour: number; status: SlotStatus }[]
  value: HourRange | null
  onChange: (range: HourRange | null) => void
}

const STATUS_HINTS: Record<Exclude<SlotStatus, 'free'>, string> = {
  past: 'Already passed',
  'courier-busy': 'Booked by someone',
  'user-busy': 'You have another courier',
}

const HourSlotPicker = ({ slots, value, onChange }: HourSlotPickerProps) => {
  const isFree = (hour: number) =>
    slots.find((slot) => slot.hour === hour)?.status === 'free'

  const select = (hour: number) => {
    if (!value) return onChange({ startHour: hour, endHour: hour + 1 })

    const isSingle = value.endHour - value.startHour === 1
    if (isSingle && hour === value.startHour) return onChange(null)

    const between = Array.from(
      { length: hour - value.startHour + 1 },
      (_, index) => value.startHour + index,
    )
    const canExtend = hour > value.startHour && between.every(isFree)

    onChange(
      canExtend
        ? { startHour: value.startHour, endHour: hour + 1 }
        : { startHour: hour, endHour: hour + 1 },
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map(({ hour, status }) => {
        const isSelected = !!value && hour >= value.startHour && hour < value.endHour
        const disabled = status !== 'free'

        return (
          <button
            key={hour}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => select(hour)}
            className={cn(
              'flex flex-col items-center rounded-xl border px-2 py-2 text-xs font-semibold transition-colors',
              isSelected
                ? 'border-primary bg-primary text-white shadow-[0_4px_14px_rgba(0,117,255,0.45)]'
                : 'border-field-border bg-field text-white hover:border-primary',
              disabled &&
                'cursor-not-allowed border-transparent bg-white/5 text-muted-foreground line-through opacity-60 hover:border-transparent',
            )}
          >
            {formatHour(hour)} – {formatHour(hour + 1)}
            {disabled && (
              <span className="text-[10px] font-normal no-underline">
                {STATUS_HINTS[status]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default HourSlotPicker
