import OptionSelect from '../controls/OptionSelect'
import type { FieldRendererProps, OptionsFieldConfig } from '../form.types'
import FormFieldWrapper from './FormFieldWrapper'

const SelectField = ({
  config,
  field,
  fieldState,
}: FieldRendererProps<OptionsFieldConfig>) => (
  <FormFieldWrapper config={config} error={fieldState.error}>
    <OptionSelect
      id={config.name}
      triggerRef={field.ref}
      value={(field.value as string) ?? ''}
      options={config.options}
      onChange={field.onChange}
      onBlur={field.onBlur}
      placeholder={config.placeholder}
      invalid={fieldState.invalid}
    />
  </FormFieldWrapper>
)

export default SelectField
