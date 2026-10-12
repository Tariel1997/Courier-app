import {
  WEEK_DAYS,
  type WeekDay,
  type WorkingHours,
  type WorkingSchedule,
} from '@/types/user.types'

export const MIN_WORKING_DAYS = 5
const HOURS_IN_DAY = 24

// Schedules saved before hours were introduced only listed day names
const LEGACY_WORKING_HOURS: WorkingHours = { startHours: '09:00', endHours: '18:00' }

export const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`

export const formatHourRange = (startHour: number, endHour: number) =>
  `${formatHour(startHour)} – ${formatHour(endHour)}`

// "15:20" → 15.33…
export const timeToHours = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours + minutes / 60
}

const hourOptions = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => {
    const value = formatHour(from + index)
    return { value, label: value }
  })

// One hour step: a shift can start at 00:00 … 23:00 and end at 01:00 … 24:00
export const START_TIME_OPTIONS = hourOptions(0, HOURS_IN_DAY - 1)
export const END_TIME_OPTIONS = hourOptions(1, HOURS_IN_DAY)

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const WEEK_DAY_OPTIONS = WEEK_DAYS.map((day) => ({
  value: day,
  label: capitalize(day),
}))

// Shape used by the dynamic form rows: one row = one day with its hours
export interface ScheduleRow {
  day: WeekDay | ''
  startHours: string
  endHours: string
}

export const EMPTY_SCHEDULE_ROW: ScheduleRow = {
  day: '',
  startHours: '',
  endHours: '',
}

const isWeekDay = (value: unknown): value is WeekDay =>
  WEEK_DAYS.includes(value as WeekDay)

// Accepts both the current object format and the legacy array of day names
export const normalizeSchedule = (raw: unknown): WorkingSchedule => {
  if (Array.isArray(raw)) {
    return Object.fromEntries(
      raw.filter(isWeekDay).map((day) => [day, LEGACY_WORKING_HOURS]),
    )
  }

  if (raw && typeof raw === 'object') {
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([day, hours]) =>
          isWeekDay(day) &&
          typeof hours?.startHours === 'string' &&
          typeof hours?.endHours === 'string',
      ),
    ) as WorkingSchedule
  }

  return {}
}

// Ordered from Monday to Sunday so the UI stays predictable
export const getScheduleEntries = (schedule: WorkingSchedule = {}) =>
  WEEK_DAYS.flatMap((day) => {
    const hours = schedule[day]
    return hours ? [{ day, ...hours }] : []
  })

export const scheduleToRows = (schedule: WorkingSchedule = {}): ScheduleRow[] =>
  getScheduleEntries(schedule)

export const rowsToSchedule = (rows: ScheduleRow[] = []): WorkingSchedule =>
  Object.fromEntries(
    rows
      .filter((row) => row.day)
      .map(({ day, startHours, endHours }) => [day, { startHours, endHours }]),
  )

// JS Date#getDay() starts the week on Sunday
export const getWeekDay = (date: Date): WeekDay => WEEK_DAYS[(date.getDay() + 6) % 7]

export const isWorkingDate = (schedule: WorkingSchedule = {}, date: Date) =>
  Boolean(schedule[getWeekDay(date)])

// Whole hours a courier can be booked for on the given date (start hour of each slot)
export const getWorkingHourSlots = (
  schedule: WorkingSchedule = {},
  date: Date,
): number[] => {
  const hours = schedule[getWeekDay(date)]
  if (!hours) return []

  const start = Math.ceil(timeToHours(hours.startHours))
  const end = Math.floor(timeToHours(hours.endHours))

  return Array.from(
    { length: Math.max(end - start, 0) },
    (_, index) => start + index,
  )
}
