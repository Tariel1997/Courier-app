import { Button } from '@/components/ui/button'
import {
  EMPTY_SCHEDULE_ROW,
  END_TIME_OPTIONS,
  START_TIME_OPTIONS,
  timeToHours,
  WEEK_DAY_OPTIONS,
  type ScheduleRow,
} from '@/lib/schedule'
import { cn } from '@/lib/utils'
import { WEEK_DAYS } from '@/types/user.types'
import { CalendarPlusIcon, PlusIcon, Trash2Icon } from 'lucide-react'

import OptionSelect from '../controls/OptionSelect'
import type { FieldRendererProps, ScheduleFieldConfig } from '../form.types'
import FormFieldWrapper from './FormFieldWrapper'

type RowErrors = Partial<Record<keyof ScheduleRow, { message?: string }>>

// react-hook-form nests row errors by index and list level errors under `root`
interface ScheduleFieldError {
  message?: string
  root?: { message?: string }
  [index: number]: RowErrors | undefined
}

const isRowComplete = (row: ScheduleRow) =>
  Boolean(row.day && row.startHours && row.endHours)

const ScheduleField = ({
  config,
  field,
  fieldState,
}: FieldRendererProps<ScheduleFieldConfig>) => {
  const rows = (field.value as ScheduleRow[] | undefined) ?? []
  const error = fieldState.error as ScheduleFieldError | undefined
  const listMessage = error?.root?.message ?? error?.message
  const completedCount = rows.filter(isRowComplete).length

  const commit = (next: ScheduleRow[]) => {
    field.onChange(next)
    field.onBlur()
  }

  const updateRow = (index: number, patch: Partial<ScheduleRow>) =>
    commit(
      rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    )

  const changeStart = (index: number, startHours: string) => {
    const { endHours } = rows[index]
    // Drop an end time that would no longer be after the new start
    const keepEnd = endHours && timeToHours(endHours) > timeToHours(startHours)
    updateRow(index, { startHours, endHours: keepEnd ? endHours : '' })
  }

  const addRow = () => field.onChange([...rows, { ...EMPTY_SCHEDULE_ROW }])
  const removeRow = (index: number) =>
    commit(rows.filter((_, rowIndex) => rowIndex !== index))

  return (
    <FormFieldWrapper
      config={config}
      error={listMessage ? { message: listMessage } : undefined}
    >
      <div id={config.name} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">
            Add at least {config.minRows} days. Hours change in 1 hour steps.
          </span>
          <span
            className={cn(
              'shrink-0 rounded-lg px-2 py-1 font-semibold',
              completedCount >= config.minRows
                ? 'bg-success/15 text-success'
                : 'bg-primary/15 text-primary',
            )}
          >
            {completedCount} / {config.minRows}
          </span>
        </div>

        {rows.length === 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-field-border p-4 text-sm text-muted-foreground">
            <CalendarPlusIcon className="size-5 text-primary" />
            No working days yet — press “Add day” to create one.
          </div>
        )}

        {rows.map((row, index) => {
          const rowErrors = error?.[index]
          const takenDays = rows
            .filter((_, rowIndex) => rowIndex !== index)
            .map((other) => other.day)

          return (
            <div
              key={index}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="grid grid-cols-2 items-start gap-2 sm:grid-cols-[1.5fr_1fr_1fr_auto]">
                <OptionSelect
                  aria-label={`Day ${index + 1}`}
                  className="col-span-2 sm:col-span-1"
                  value={row.day}
                  placeholder="Select day"
                  invalid={!!rowErrors?.day}
                  options={WEEK_DAY_OPTIONS.map((option) => ({
                    ...option,
                    disabled: takenDays.includes(option.value),
                  }))}
                  onChange={(day) =>
                    updateRow(index, { day: day as ScheduleRow['day'] })
                  }
                />
                <OptionSelect
                  aria-label={`Start time ${index + 1}`}
                  value={row.startHours}
                  placeholder="Start"
                  invalid={!!rowErrors?.startHours}
                  options={START_TIME_OPTIONS}
                  onChange={(value) => changeStart(index, value)}
                />
                <OptionSelect
                  aria-label={`End time ${index + 1}`}
                  value={row.endHours}
                  placeholder="End"
                  invalid={!!rowErrors?.endHours}
                  options={END_TIME_OPTIONS.map((option) => ({
                    ...option,
                    disabled:
                      !!row.startHours &&
                      timeToHours(option.value) <= timeToHours(row.startHours),
                  }))}
                  onChange={(endHours) => updateRow(index, { endHours })}
                />
                <Button
                  type="button"
                  size="icon-lg"
                  variant="destructive"
                  onClick={() => removeRow(index)}
                  aria-label={`Remove day ${index + 1}`}
                  className="col-span-2 h-11 w-full rounded-2xl sm:col-span-1 sm:w-11"
                >
                  <Trash2Icon />
                </Button>
              </div>

              {rowErrors && (
                <p className="mt-2 text-xs text-destructive">
                  {rowErrors.day?.message ??
                    rowErrors.startHours?.message ??
                    rowErrors.endHours?.message}
                </p>
              )}
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addRow}
          disabled={rows.length >= WEEK_DAYS.length}
          className="h-11 rounded-2xl border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:text-white"
        >
          <PlusIcon /> Add day
        </Button>
      </div>
    </FormFieldWrapper>
  )
}

export default ScheduleField
