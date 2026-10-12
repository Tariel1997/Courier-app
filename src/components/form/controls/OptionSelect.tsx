import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Ref } from 'react'

import type { FieldOption } from '../form.types'
import { fieldControlClassName } from './field-styles'

export interface SelectOption extends FieldOption {
  disabled?: boolean
}

interface OptionSelectProps {
  id?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  invalid?: boolean
  triggerRef?: Ref<HTMLButtonElement>
  className?: string
  'aria-label'?: string
}

// Dark themed shadcn select driven by a plain list of options
const OptionSelect = ({
  id,
  value,
  options,
  onChange,
  onBlur,
  placeholder,
  invalid,
  triggerRef,
  className,
  'aria-label': ariaLabel,
}: OptionSelectProps) => (
  <Select
    items={options}
    value={value || null}
    onValueChange={(next) => onChange((next as string | null) ?? '')}
  >
    <SelectTrigger
      id={id}
      ref={triggerRef}
      onBlur={onBlur}
      aria-invalid={invalid}
      aria-label={ariaLabel}
      className={cn(
        fieldControlClassName,
        'w-full data-[size=default]:h-11',
        className,
      )}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="max-h-72 border border-field-border bg-field text-white">
      {options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export default OptionSelect
