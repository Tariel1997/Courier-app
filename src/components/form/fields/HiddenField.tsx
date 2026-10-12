import type { FieldRendererProps, HiddenFieldConfig } from '../form.types'

// Keeps a value (e.g. the selected role) inside the form without rendering a control
const HiddenField = ({ field }: FieldRendererProps<HiddenFieldConfig>) => (
  <input type="hidden" name={field.name} value={String(field.value ?? '')} />
)

export default HiddenField
