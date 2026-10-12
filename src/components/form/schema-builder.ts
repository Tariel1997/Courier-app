import { EMPTY_SCHEDULE_ROW } from '@/lib/schedule'
import { z } from 'zod'

import type { FieldConfig, FieldType } from './form.types'

const isEmpty = (value: unknown) =>
  (typeof value === 'string' && value.trim() === '') ||
  value === null ||
  value === undefined ||
  (Array.isArray(value) && value.length === 0)

// Empty values of optional fields are normalized to `undefined` before validation
const toOptional = (schema: z.ZodType) =>
  z.preprocess((value) => (isEmpty(value) ? undefined : value), schema.optional())

export const buildSchema = (fields: FieldConfig[]) =>
  z.object(
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.optional ? toOptional(field.schema) : field.schema,
      ]),
    ),
  )

const EMPTY_VALUES: Record<FieldType, unknown> = {
  text: '',
  email: '',
  password: '',
  tel: '',
  textarea: '',
  select: '',
  'checkbox-group': [],
  image: '',
  hidden: '',
  schedule: [EMPTY_SCHEDULE_ROW],
}

export const buildDefaultValues = (
  fields: FieldConfig[],
  overrides: Record<string, unknown> = {},
) => ({
  ...Object.fromEntries(
    fields.map((field) => [field.name, EMPTY_VALUES[field.type]]),
  ),
  ...overrides,
})
