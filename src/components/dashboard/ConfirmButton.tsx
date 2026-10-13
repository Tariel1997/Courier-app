import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/get-error-message'
import { Loader2Icon, type LucideIcon } from 'lucide-react'
import { useState } from 'react'

interface ConfirmButtonProps {
  label: string
  icon: LucideIcon
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => Promise<void>
}

const ConfirmButton = ({
  label,
  icon: Icon,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmButtonProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsPending(true)
    setError(null)
    try {
      await onConfirm()
      setOpen(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setOpen(true)}
        className="rounded-xl"
      >
        <Icon /> {label}
      </Button>

      <AlertDialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <AlertDialogContent className="glass-card bg-[#0b1033] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <AlertDialogFooter className="border-white/5 bg-transparent">
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ConfirmButton
