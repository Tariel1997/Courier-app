import { rowsToSchedule, scheduleToRows, type ScheduleRow } from '@/lib/schedule'
import type { ProfilePatch } from '@/service/profiles/profiles.service'
import type { User, UserProfileData, Vehicle } from '@/types/user.types'

export interface ProfileFormValues extends Record<string, unknown> {
  firstName?: string
  lastName?: string
  pid?: string
  phoneNumber?: string
  profileImage?: string
  address?: string
  vehicle?: Vehicle
  workingDays?: ScheduleRow[]
}

const DATA_KEYS = [
  'pid',
  'phoneNumber',
  'profileImage',
  'address',
  'vehicle',
] as const satisfies (keyof UserProfileData)[]

export const toProfileFormValues = (user: User): ProfileFormValues => ({
  firstName: user.firstName,
  lastName: user.lastName,
  ...Object.fromEntries(DATA_KEYS.map((key) => [key, user.data?.[key] ?? ''])),
  workingDays: scheduleToRows(user.data?.workingDays),
})

export const toProfilePatch = (
  values: ProfileFormValues,
  fieldNames: string[],
): ProfilePatch => {
  const has = (key: string) => fieldNames.includes(key)
  const data: UserProfileData = {}

  for (const key of DATA_KEYS) {
    if (has(key)) Object.assign(data, { [key]: values[key] ?? '' })
  }
  if (has('workingDays')) data.workingDays = rowsToSchedule(values.workingDays)

  return {
    ...(has('firstName') && { firstName: values.firstName }),
    ...(has('lastName') && { lastName: values.lastName ?? '' }),
    data,
  }
}
