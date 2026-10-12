import type { FieldConfig } from '@/components/form/form.types'
import {
  addressField,
  firstNameField,
  lastNameField,
  phoneNumberField,
  pidField,
  profileImageField,
  vehicleField,
  workingDaysField,
} from '@/features/auth/fields/user-fields'
import { ROLES, type Role } from '@/types/user.types'

// Email and password are not editable — the API has no endpoint for credentials
const baseProfileFields: FieldConfig[] = [
  firstNameField,
  lastNameField,
  pidField,
  phoneNumberField,
  profileImageField,
]

export const profileTemplates: Record<Role, FieldConfig[]> = {
  [ROLES.ADMIN]: baseProfileFields,
  [ROLES.USER]: [...baseProfileFields, addressField],
  [ROLES.COURIER]: [...baseProfileFields, vehicleField, workingDaysField],
}

// Admins may only change when a courier works
export const courierScheduleTemplate: FieldConfig[] = [workingDaysField]
