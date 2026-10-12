import type { FieldConfig } from '@/components/form/form.types'
import { capitalize, MIN_WORKING_DAYS, timeToHours } from '@/lib/schedule'
import { ROLE_LIST, VEHICLES, WEEK_DAYS } from '@/types/user.types'
import { z } from 'zod'

const nameSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} must be at least 2 characters`)
    .max(32, `${label} must be at most 32 characters`)
    .regex(/^[\p{L}\s'-]+$/u, `${label} can only contain letters`)

// Each field is a reusable building block; templates only compose them

export const firstNameField: FieldConfig = {
  name: 'firstName',
  label: 'First name',
  type: 'text',
  placeholder: 'John',
  autoComplete: 'given-name',
  schema: nameSchema('First name'),
}

export const lastNameField: FieldConfig = {
  name: 'lastName',
  label: 'Last name',
  type: 'text',
  placeholder: 'Doe',
  autoComplete: 'family-name',
  optional: true,
  schema: nameSchema('Last name'),
}

export const pidField: FieldConfig = {
  name: 'pid',
  label: 'Personal ID',
  type: 'text',
  placeholder: '01001012345',
  schema: z
    .string()
    .trim()
    .min(1, 'Personal ID is required')
    .regex(/^\d{11}$/, 'Personal ID must contain exactly 11 digits'),
}

export const phoneNumberField: FieldConfig = {
  name: 'phoneNumber',
  label: 'Phone number',
  type: 'tel',
  placeholder: '+995 5XX XXX XXX',
  autoComplete: 'tel',
  schema: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .pipe(
      z
        .string()
        .regex(
          /^(\+995)?5\d{8}$/,
          'Enter a valid Georgian mobile number (5XXXXXXXX)',
        ),
    ),
}

export const emailField: FieldConfig = {
  name: 'email',
  label: 'Email',
  type: 'email',
  placeholder: 'your@email.com',
  autoComplete: 'email',
  schema: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email('Enter a valid email')),
}

export const passwordField: FieldConfig = {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'At least 8 characters',
  autoComplete: 'new-password',
  schema: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
}

// Login only checks presence — complexity rules apply on registration
export const loginPasswordField: FieldConfig = {
  ...passwordField,
  placeholder: 'Your password',
  autoComplete: 'current-password',
  schema: z.string().min(1, 'Password is required'),
}

export const profileImageField: FieldConfig = {
  name: 'profileImage',
  label: 'Profile image',
  type: 'image',
  placeholder: 'https://example.com/avatar.png',
  optional: true,
  colSpan: 2,
  schema: z
    .string()
    .trim()
    .pipe(
      z.url({
        protocol: /^https?$/,
        error: 'Enter a valid image link (http:// or https://)',
      }),
    ),
}

export const roleField: FieldConfig = {
  name: 'role',
  label: 'Role',
  type: 'hidden',
  schema: z.enum(ROLE_LIST, 'Select a role'),
}

export const addressField: FieldConfig = {
  name: 'address',
  label: 'Address',
  type: 'textarea',
  placeholder: 'City, street, building, apartment',
  autoComplete: 'street-address',
  colSpan: 2,
  schema: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be at most 200 characters'),
}

export const vehicleField: FieldConfig = {
  name: 'vehicle',
  label: 'Vehicle',
  type: 'select',
  placeholder: 'Select vehicle',
  colSpan: 2,
  options: VEHICLES.map((vehicle) => ({
    value: vehicle,
    label: capitalize(vehicle),
  })),
  schema: z.enum(VEHICLES, 'Select a vehicle'),
}

const scheduleRowSchema = z
  .object({
    day: z.enum(WEEK_DAYS, 'Select a day'),
    startHours: z.string().min(1, 'Select a start time'),
    endHours: z.string().min(1, 'Select an end time'),
  })
  .refine((row) => timeToHours(row.endHours) > timeToHours(row.startHours), {
    path: ['endHours'],
    message: 'End time must be after the start time',
  })

export const workingDaysField: FieldConfig = {
  name: 'workingDays',
  label: 'Working days & hours',
  type: 'schedule',
  minRows: MIN_WORKING_DAYS,
  colSpan: 2,
  schema: z
    .array(scheduleRowSchema)
    // `root` keeps this message next to the per-row errors; `when` runs it even
    // while some rows are still invalid
    .refine((rows) => rows.length >= MIN_WORKING_DAYS, {
      path: ['root'],
      message: `Add at least ${MIN_WORKING_DAYS} working days`,
      when: () => true,
    })
    .superRefine((rows, ctx) => {
      rows.forEach((row, index) => {
        if (rows.findIndex((other) => other.day === row.day) !== index)
          ctx.addIssue({
            code: 'custom',
            path: [index, 'day'],
            message: 'This day is already added',
          })
      })
    }),
}
