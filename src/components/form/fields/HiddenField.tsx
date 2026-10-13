import type { FieldRendererProps, HiddenFieldConfig } from '../form.types'

const HiddenField = ({ field }: FieldRendererProps<HiddenFieldConfig>) => (
  <input type="hidden" name={field.name} value={String(field.value ?? '')} />
)

export default HiddenField
