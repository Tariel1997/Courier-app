import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon, CircleCheckIcon, Loader2Icon } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'

import { getFieldRenderer } from './field-registry'
import type { FieldConfig } from './form.types'
import { buildDefaultValues, buildSchema } from './schema-builder'

type FormValues = Record<string, unknown>

interface BaseFormProps<TValues extends FormValues> {
  fields: FieldConfig[]
  onSubmit: (values: TValues) => Promise<void> | void
  submitLabel: string
  defaultValues?: Partial<TValues>
  serverError?: string | null
  successMessage?: string | null
  footer?: ReactNode
  className?: string
}

function BaseForm<TValues extends FormValues>({
  fields,
  onSubmit,
  submitLabel,
  defaultValues,
  serverError,
  successMessage,
  footer,
  className,
}: BaseFormProps<TValues>) {
  const schema = useMemo(() => buildSchema(fields), [fields])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: buildDefaultValues(fields, defaultValues),
    mode: 'onTouched',
  })

  const { isSubmitting } = form.formState

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => onSubmit(values as TValues))}
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        {fields.map((config) => {
          const Renderer = getFieldRenderer(config.type)

          return (
            <Controller
              key={config.name}
              name={config.name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Renderer config={config} field={field} fieldState={fieldState} />
              )}
            />
          )
        })}
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircleIcon className="size-4 shrink-0" />
          {serverError}
        </div>
      )}

      {successMessage && !serverError && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <CircleCheckIcon className="size-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-11 w-full rounded-2xl bg-primary text-xs font-bold tracking-wider uppercase hover:bg-primary/85"
      >
        {isSubmitting && <Loader2Icon className="animate-spin" />}
        {submitLabel}
      </Button>

      {footer}
    </form>
  )
}

export default BaseForm
