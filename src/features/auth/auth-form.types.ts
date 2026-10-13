import type { ScheduleRow } from '@/lib/schedule'
import type { Role, Vehicle } from '@/types/user.types'

export interface LoginFormValues extends Record<string, unknown> {
  email: string
  password: string
  role: Role
}

export interface RegisterFormValues extends Record<string, unknown> {
  role: Role
  firstName: string
  lastName?: string
  pid: string
  phoneNumber: string
  email: string
  password: string
  profileImage?: string
  address?: string
  vehicle?: Vehicle
  workingDays?: ScheduleRow[]
}
