import $api from '@/api'
import { ENDPOINTS } from '@/config'
import { normalizeSchedule } from '@/lib/schedule'
import type { Role, User } from '@/types/user.types'

interface UserFilters {
  role?: Role
  search?: string
}

export const normalizeUser = (user: User): User =>
  user.data?.workingDays
    ? {
        ...user,
        data: {
          ...user.data,
          workingDays: normalizeSchedule(user.data.workingDays),
        },
      }
    : user

const getUsers = async (filters: UserFilters = {}) => {
  const { data } = await $api.get<User[]>(ENDPOINTS.USERS, { params: filters })
  return data.map(normalizeUser)
}

export default getUsers
