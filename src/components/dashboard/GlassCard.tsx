import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

const GlassCard = ({ className, ...props }: ComponentProps<'section'>) => (
  <section
    className={cn('glass-card rounded-[1.25rem] p-5', className)}
    {...props}
  />
)

export default GlassCard
