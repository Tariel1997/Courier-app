import type { FieldConfig } from '@/components/form/form.types'
import { ROLES, type Role } from '@/types/user.types'

import {
  addressField,
  emailField,
  firstNameField,
  lastNameField,
  loginPasswordField,
  passwordField,
  phoneNumberField,
  pidField,
  profileImageField,
  roleField,
  vehicleField,
  workingDaysField,
} from '../fields/user-fields'

export const adminRegisterTemplate: FieldConfig[] = [
  firstNameField,
  lastNameField,
  pidField,
  phoneNumberField,
  emailField,
  passwordField,
  profileImageField,
  roleField,
]

export const userRegisterTemplate: FieldConfig[] = [
  firstNameField,
  lastNameField,
  pidField,
  phoneNumberField,
  emailField,
  passwordField,
  profileImageField,
  roleField,
  addressField,
]

export const courierRegisterTemplate: FieldConfig[] = [
  roleField,
  firstNameField,
  lastNameField,
  pidField,
  phoneNumberField,
  emailField,
  passwordField,
  profileImageField,
  vehicleField,
  workingDaysField,
]

export const registerTemplates: Record<Role, FieldConfig[]> = {
  [ROLES.ADMIN]: adminRegisterTemplate,
  [ROLES.USER]: userRegisterTemplate,
  [ROLES.COURIER]: courierRegisterTemplate,
}

export const loginTemplate: FieldConfig[] = [
  { ...emailField, colSpan: 2 },
  { ...loginPasswordField, colSpan: 2 },
  roleField,
]
