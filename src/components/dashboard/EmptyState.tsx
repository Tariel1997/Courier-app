import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center">
    <Icon className="size-9 text-primary" />
    <p className="font-semibold text-white">{title}</p>
    {description && (
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    )}
  </div>
)

export default EmptyState
