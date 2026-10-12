import { buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

interface DatePickerButtonProps {
  value: Date
  onChange: (date: Date) => void
}

const DatePickerButton = ({ value, onChange }: DatePickerButtonProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'rounded-xl border-field-border bg-field text-white',
        )}
      >
        <CalendarIcon className="text-primary" />
        {format(value, 'EEE, d MMM yyyy')}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-auto border border-white/10 bg-field p-0"
      >
        <Calendar
          mode="single"
          required
          selected={value}
          defaultMonth={value}
          weekStartsOn={1}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          className="rounded-2xl bg-field"
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePickerButton
