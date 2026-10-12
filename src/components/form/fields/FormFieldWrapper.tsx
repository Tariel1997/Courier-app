import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

import type { FieldConfig } from '../form.types'

interface FormFieldWrapperProps {
  config: FieldConfig
  error?: { message?: string }
  children: ReactNode
}

// Shared label / description / error layout for every visible field
const FormFieldWrapper = ({ config, error, children }: FormFieldWrapperProps) => (
  <Field
    data-invalid={!!error}
    className={cn('gap-2', config.colSpan === 2 && 'sm:col-span-2')}
  >
    <FieldLabel htmlFor={config.name} className="text-sm font-medium text-white">
      {config.label}
      {config.optional && (
        <span className="text-xs font-normal text-muted-foreground">(optional)</span>
      )}
    </FieldLabel>
    {children}
    {config.description && !error && (
      <FieldDescription className="text-xs">{config.description}</FieldDescription>
    )}
    <FieldError errors={[error]} className="text-xs" />
  </Field>
)

export default FormFieldWrapper
