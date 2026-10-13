import BaseForm from '@/components/form/BaseForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { RegisterFormValues } from '@/features/auth/auth-form.types'
import { toRegisterPayload } from '@/features/auth/mappers/register.mapper'
import { registerTemplates } from '@/features/auth/templates'
import { getErrorMessage } from '@/lib/get-error-message'
import { useAccountsStore } from '@/store/accounts.store'
import { ROLE_LABELS, type Role } from '@/types/user.types'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

interface CreateAccountDialogProps {
  role: Role
}

const CreateAccountDialog = ({ role }: CreateAccountDialogProps) => {
  const createAccount = useAccountsStore((state) => state.createAccount)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const label = ROLE_LABELS[role].toLowerCase()

  const handleSubmit = async (values: RegisterFormValues) => {
    setError(null)
    try {
      await createAccount(toRegisterPayload(values))
      setOpen(false)
    } catch (err) {
      setError(getErrorMessage(err, `Could not create the ${label}`))
    }
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          setError(null)
          setOpen(true)
        }}
        className="rounded-xl text-xs font-bold"
      >
        <PlusIcon /> Add {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-h-[calc(100svh-2rem)] overflow-y-auto bg-[#0b1033] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">New {label}</DialogTitle>
            <DialogDescription>
              The account can sign in right away with this email and password.
            </DialogDescription>
          </DialogHeader>

          {open && (
            <BaseForm<RegisterFormValues>
              fields={registerTemplates[role]}
              defaultValues={{ role }}
              onSubmit={handleSubmit}
              serverError={error}
              submitLabel={`Create ${label}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateAccountDialog
