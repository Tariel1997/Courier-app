import type { LucideIcon } from 'lucide-react'

import GlassCard from './GlassCard'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
}

const StatCard = ({ label, value, hint, icon: Icon }: StatCardProps) => (
  <GlassCard className="flex items-center justify-between gap-4 py-4">
    <div className="min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="truncate text-lg font-bold text-white">
        {value}
        {hint && (
          <span className="ml-2 text-xs font-semibold text-success">{hint}</span>
        )}
      </p>
    </div>
    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
      <Icon className="size-5" />
    </span>
  </GlassCard>
)

export default StatCard
