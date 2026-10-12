import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ImageOffIcon, UserIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

import { fieldControlClassName } from '../controls/field-styles'
import type { FieldRendererProps, ImageFieldConfig } from '../form.types'
import FormFieldWrapper from './FormFieldWrapper'

// Accepts an image link and previews it; the link itself is what gets submitted
const ImageField = ({
  config,
  field,
  fieldState,
}: FieldRendererProps<ImageFieldConfig>) => {
  const url = ((field.value as string) ?? '').trim()
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null)

  const canPreview = !!url && !fieldState.invalid && brokenUrl !== url
  const isBroken = !!url && !fieldState.invalid && brokenUrl === url

  return (
    <FormFieldWrapper config={config} error={fieldState.error}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/15 text-primary',
            isBroken && 'bg-destructive/15 text-destructive',
          )}
        >
          {canPreview ? (
            <img
              src={url}
              alt="Profile preview"
              className="size-full object-cover"
              onError={() => setBrokenUrl(url)}
            />
          ) : isBroken ? (
            <ImageOffIcon className="size-5" />
          ) : (
            <UserIcon className="size-5" />
          )}
        </div>

        <div className="relative flex-1">
          <Input
            id={config.name}
            ref={field.ref}
            name={field.name}
            type="url"
            inputMode="url"
            value={(field.value as string) ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={config.placeholder}
            aria-invalid={fieldState.invalid}
            className={cn(fieldControlClassName, url && 'pr-11')}
          />
          {url && (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={() => field.onChange('')}
              aria-label="Clear image link"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              <XIcon />
            </Button>
          )}
        </div>
      </div>

      {isBroken && (
        <p className="text-xs text-amber-400">
          Could not load an image from this link — you can still submit it.
        </p>
      )}
    </FormFieldWrapper>
  )
}

export default ImageField
