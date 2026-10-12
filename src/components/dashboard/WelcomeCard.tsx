import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface WelcomeCardProps {
  name: string
  message: ReactNode
  className?: string
}

const WelcomeCard = ({ name, message, className }: WelcomeCardProps) => (
  <section
    className={cn(
      'relative min-h-56 overflow-hidden rounded-[1.25rem] bg-[radial-gradient(circle_at_75%_40%,#3b4bff_0%,#1b2087_30%,#0a0f3d_65%)] p-6',
      className,
    )}
  >
    <div className="pointer-events-none absolute -top-10 right-10 size-56 rounded-full bg-[radial-gradient(circle,#8f6bff_0%,transparent_70%)] opacity-70 blur-xl" />
    <div className="relative z-10 flex h-full flex-col justify-between gap-6">
      <div>
        <p className="text-sm text-white/60">Welcome back,</p>
        <h2 className="text-3xl font-bold text-white">{name}</h2>
        <div className="mt-2 max-w-sm text-sm text-white/70">{message}</div>
      </div>
    </div>
  </section>
)

export default WelcomeCard
