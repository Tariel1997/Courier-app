export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  COURIER: 'courier',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LIST: Role[] = Object.values(ROLES)

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  user: 'User',
  courier: 'Courier',
}

export const VEHICLES = ['car', 'motorcycle', 'scooter', 'bicycle'] as const
export type Vehicle = (typeof VEHICLES)[number]

export const WEEK_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const
export type WeekDay = (typeof WEEK_DAYS)[number]

export interface WorkingHours {
  startHours: string
  endHours: string
}

export type WorkingSchedule = Partial<Record<WeekDay, WorkingHours>>

export interface UserProfileData {
  pid?: string
  phoneNumber?: string
  profileImage?: string
  address?: string
  vehicle?: Vehicle
  workingDays?: WorkingSchedule
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
  data?: UserProfileData
}

export const isRole = (value: unknown): value is Role =>
  ROLE_LIST.includes(value as Role)

export const getFullName = (user: Pick<User, 'firstName' | 'lastName'>) =>
  `${user.firstName} ${user.lastName ?? ''}`.trim()
