import CheckboxGroupField from './fields/CheckboxGroupField'
import HiddenField from './fields/HiddenField'
import ImageField from './fields/ImageField'
import InputField from './fields/InputField'
import ScheduleField from './fields/ScheduleField'
import SelectField from './fields/SelectField'
import type { FieldConfig, FieldRenderer, FieldType } from './form.types'

type RendererMap = {
  [T in FieldType]: FieldRenderer<Extract<FieldConfig, { type: T }>>
}

const fieldRegistry: RendererMap = {
  text: InputField,
  email: InputField,
  password: InputField,
  tel: InputField,
  textarea: InputField,
  select: SelectField,
  'checkbox-group': CheckboxGroupField,
  image: ImageField,
  hidden: HiddenField,
  schedule: ScheduleField,
}

export const getFieldRenderer = (type: FieldType) =>
  fieldRegistry[type] as FieldRenderer
