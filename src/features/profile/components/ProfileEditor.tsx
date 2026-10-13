import SectionCard from '@/components/dashboard/SectionCard'
import BaseForm from '@/components/form/BaseForm'
import type { FieldConfig } from '@/components/form/form.types'
import { getBookedWeekDays } from '@/lib/booking-rules'
import { useBookingsStore } from '@/store/bookings.store'
import type { User } from '@/types/user.types'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'

import { toProfileFormValues, type ProfileFormValues } from '../profile.mapper'
import { useUpdateProfile } from '../use-update-profile'

interface ProfileEditorProps {
  account: User
  fields: FieldConfig[]
  title: string
  description?: string
  submitLabel?: string
}

const ProfileEditor = ({
  account,
  fields,
  title,
  description,
  submitLabel = 'Save changes',
}: ProfileEditorProps) => {
  const bookings = useBookingsStore((state) => state.bookings)
  const lockedDays = useMemo(
    () => getBookedWeekDays(bookings, account.id),
    [bookings, account.id],
  )
  const formFields = useMemo(
    () =>
      fields.map((field) =>
        field.type === 'schedule' ? { ...field, lockedDays } : field,
      ),
    [fields, lockedDays],
  )

  const { submit, error, savedAt } = useUpdateProfile(account.id, fields)
  const [defaultValues] = useState(() => toProfileFormValues(account))

  return (
    <SectionCard title={title} description={description}>
      <BaseForm<ProfileFormValues>
        fields={formFields}
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
