import type { WeekDay } from '@/types/user.types'
import type { ComponentType } from 'react'
import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import type { z } from 'zod'

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'checkbox-group'
  | 'image'
  | 'hidden'
  | 'schedule'

export interface FieldOption {
  label: string
  value: string
}

interface BaseFieldConfig {
  name: string
  label: string
  schema: z.ZodType
  optional?: boolean
  placeholder?: string
  description?: string
  autoComplete?: string
  colSpan?: 1 | 2
}

export interface InputFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea'
}

export interface OptionsFieldConfig extends BaseFieldConfig {
  type: 'select' | 'checkbox-group'
  options: FieldOption[]
}

export interface ImageFieldConfig extends BaseFieldConfig {
  type: 'image'
}

export interface HiddenFieldConfig extends BaseFieldConfig {
  type: 'hidden'
}

export interface ScheduleFieldConfig extends BaseFieldConfig {
  type: 'schedule'
  minRows: number
  lockedDays?: WeekDay[]
}

export type FieldConfig =
  | InputFieldConfig
  | OptionsFieldConfig
  | ImageFieldConfig
  | HiddenFieldConfig
  | ScheduleFieldConfig

export interface FieldRendererProps<TConfig extends FieldConfig = FieldConfig> {
  config: TConfig
  field: ControllerRenderProps<Record<string, unknown>, string>
  fieldState: ControllerFieldState
}

export type FieldRenderer<TConfig extends FieldConfig = FieldConfig> = ComponentType<
  FieldRendererProps<TConfig>
>
