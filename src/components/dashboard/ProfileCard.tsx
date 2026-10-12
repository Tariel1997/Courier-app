import type { User } from '@/types/user.types'
import type { ReactNode } from 'react'

import GlassCard from './GlassCard'

export interface ProfileRow {
  label: string
  value: ReactNode
}

interface ProfileCardProps {
  user: User
  extraRows?: ProfileRow[]
  title?: string
  subtitle?: string
}

const ProfileCard = ({
  user,
  extraRows = [],
  title = 'Profile information',
  subtitle = 'Personal data',
}: ProfileCardProps) => {
  const rows: ProfileRow[] = [
    { label: 'Full name', value: `${user.firstName} ${user.lastName}`.trim() },
    { label: 'Email', value: user.email },
    { label: 'Personal ID', value: user.data?.pid ?? '—' },
    { label: 'Phone', value: user.data?.phoneNumber ?? '—' },
    ...extraRows,
  ]

  return (
    <GlassCard>
      <h3 className="mb-1 text-lg font-bold text-white">{title}</h3>
      <p className="mb-5 text-xs text-muted-foreground">{subtitle}</p>
      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-baseline gap-x-2 text-sm"
          >
            <dt className="font-semibold text-muted-foreground">{row.label}:</dt>
            <dd className="min-w-0 break-words text-white">{row.value}</dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  )
}

export default ProfileCard
