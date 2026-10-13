import { rowsToSchedule } from '@/lib/schedule'
import type { RegisterPayload } from '@/service/auth/auth.types'
import type { UserProfileData } from '@/types/user.types'

import type { RegisterFormValues } from '../auth-form.types'

const compact = <T extends object>(object: T) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  ) as T

export const toRegisterPayload = (values: RegisterFormValues): RegisterPayload => {
  const { firstName, lastName, email, password, role, profileImage, ...rest } =
    values

  const data: UserProfileData = compact({
    pid: rest.pid,
    phoneNumber: rest.phoneNumber,
    address: rest.address,
    vehicle: rest.vehicle,
    workingDays: rest.workingDays && rowsToSchedule(rest.workingDays),
    profileImage,
  })

  return {
    firstName,
    lastName: lastName ?? '',
    email,
    password,
    role,
    data,
  }
}
