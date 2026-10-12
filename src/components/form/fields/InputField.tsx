import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

import { fieldControlClassName } from '../controls/field-styles'
import type { FieldRendererProps, InputFieldConfig } from '../form.types'
import FormFieldWrapper from './FormFieldWrapper'

const InputField = ({
  config,
  field,
  fieldState,
}: FieldRendererProps<InputFieldConfig>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = config.type === 'password'

  const sharedProps = {
    id: config.name,
    name: field.name,
    value: (field.value as string) ?? '',
    onChange: field.onChange,
    onBlur: field.onBlur,
    placeholder: config.placeholder,
    autoComplete: config.autoComplete,
    'aria-invalid': fieldState.invalid,
  }

  return (
    <FormFieldWrapper config={config} error={fieldState.error}>
      {config.type === 'textarea' ? (
        <Textarea
          {...sharedProps}
          ref={field.ref}
          rows={3}
          className={`${fieldControlClassName} h-auto min-h-20 py-3`}
        />
      ) : (
        <div className="relative">
          <Input
            {...sharedProps}
            ref={field.ref}
            type={isPassword && isPasswordVisible ? 'text' : config.type}
            className={`${fieldControlClassName} ${isPassword ? 'pr-11' : ''}`}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-white"
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          )}
        </div>
      )}
    </FormFieldWrapper>
  )
}

export default InputField
