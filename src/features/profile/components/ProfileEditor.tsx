import SectionCard from '@/components/dashboard/SectionCard'
import BaseForm from '@/components/form/BaseForm'
import type { FieldConfig } from '@/components/form/form.types'
import type { User } from '@/types/user.types'
import { format } from 'date-fns'
import { useState } from 'react'

import { toProfileFormValues, type ProfileFormValues } from '../profile.mapper'
import { useUpdateProfile } from '../use-update-profile'

interface ProfileEditorProps {
  account: User
  fields: FieldConfig[]
  title: string
  description?: string
  submitLabel?: string
}

// Edits any subset of an account's profile described by `fields`
const ProfileEditor = ({
  account,
  fields,
  title,
  description,
  submitLabel = 'Save changes',
}: ProfileEditorProps) => {
  const { submit, error, savedAt } = useUpdateProfile(account.id, fields)
  // Defaults are captured once per account so saving doesn't reset the form
  const [defaultValues] = useState(() => toProfileFormValues(account))

  return (
    <SectionCard title={title} description={description}>
      <BaseForm<ProfileFormValues>
        fields={fields}
        defaultValues={defaultValues}
        onSubmit={submit}
        serverError={error}
        successMessage={savedAt && `Changes saved at ${format(savedAt, 'HH:mm:ss')}`}
        submitLabel={submitLabel}
      />
    </SectionCard>
  )
}

export default ProfileEditor
