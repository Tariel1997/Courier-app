import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

import type { FieldRendererProps, OptionsFieldConfig } from '../form.types'
import FormFieldWrapper from './FormFieldWrapper'

const CheckboxGroupField = ({
  config,
  field,
  fieldState,
}: FieldRendererProps<OptionsFieldConfig>) => {
  const selected = (field.value as string[]) ?? []

  const toggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...selected, value]
      : selected.filter((item) => item !== value)

    field.onChange(
      config.options
        .map((option) => option.value)
        .filter((optionValue) => next.includes(optionValue)),
    )
    field.onBlur()
  }

  return (
    <FormFieldWrapper config={config} error={fieldState.error}>
      <div
        id={config.name}
        role="group"
        aria-invalid={fieldState.invalid}
        className="flex flex-wrap gap-2"
      >
        {config.options.map((option) => {
          const isChecked = selected.includes(option.value)

          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors select-none',
                isChecked
                  ? 'border-primary bg-primary/20 text-white'
                  : 'border-field-border bg-field text-muted-foreground hover:text-white',
                fieldState.invalid && !isChecked && 'border-destructive/60',
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => toggle(option.value, checked)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </FormFieldWrapper>
  )
}

export default CheckboxGroupField
