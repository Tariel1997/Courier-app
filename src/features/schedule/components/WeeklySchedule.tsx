import { cn } from '@/lib/utils'
import { WEEK_DAYS, type WorkingSchedule } from '@/types/user.types'

interface WeeklyScheduleProps {
  schedule?: WorkingSchedule
  className?: string
}

const WeeklySchedule = ({ schedule = {}, className }: WeeklyScheduleProps) => (
  <div className={cn('grid grid-cols-4 gap-2 sm:grid-cols-7', className)}>
    {WEEK_DAYS.map((day) => {
      const hours = schedule[day]

      return (
        <div
          key={day}
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-center',
            hours ? 'bg-primary/90 text-white' : 'bg-field text-muted-foreground',
          )}
        >
          <span className="text-xs font-bold capitalize">{day.slice(0, 3)}</span>
          {hours ? (
            <span className="text-[10px] leading-tight font-medium text-white/85">
              {hours.startHours}
              <br />
              {hours.endHours}
            </span>
          ) : (
            <span className="text-[10px] leading-tight">Day off</span>
          )}
        </div>
      )
    })}
  </div>
)

export default WeeklySchedule
