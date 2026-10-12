import type { FieldConfig } from '@/components/form/form.types'
import { getErrorMessage } from '@/lib/get-error-message'
import { useAccountsStore } from '@/store/accounts.store'
import { useAuthStore } from '@/store/auth.store'
import { useState } from 'react'

import { toProfilePatch, type ProfileFormValues } from './profile.mapper'

// Saves profile edits of any account; the own session is refreshed when needed
export const useUpdateProfile = (userId: number, fields: FieldConfig[]) => {
  const updateAccount = useAccountsStore((state) => state.updateAccount)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const submit = async (values: ProfileFormValues) => {
    setError(null)
    setSavedAt(null)
    try {
      const patch = toProfilePatch(
        values,
        fields.map((field) => field.name),
      )
      const updated = await updateAccount(userId, patch)

      const { user, setUser } = useAuthStore.getState()
      if (user?.id === userId) setUser(updated)
      setSavedAt(new Date())
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save changes'))
    }
  }

  return { submit, error, savedAt }
}
