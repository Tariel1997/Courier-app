import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

import GlassCard from './GlassCard'

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

const SectionCard = ({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) => (
  <GlassCard className={cn('flex min-w-0 flex-col gap-4', className)}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
    {children}
  </GlassCard>
)

export default SectionCard
