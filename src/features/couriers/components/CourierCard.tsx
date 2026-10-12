import GlassCard from '@/components/dashboard/GlassCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import WeeklySchedule from '@/features/schedule/components/WeeklySchedule'
import { cn } from '@/lib/utils'
import { getFullName, type User } from '@/types/user.types'
import { PhoneIcon, TruckIcon, UsersIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface CourierCardProps {
  courier: User
  customersCount: number
  action?: ReactNode
  highlighted?: boolean
}

const CourierCard = ({
  courier,
  customersCount,
  action,
  highlighted,
}: CourierCardProps) => {
  const initials =
    `${courier.firstName[0] ?? ''}${courier.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <GlassCard
      className={cn('flex flex-col gap-4', highlighted && 'ring-1 ring-primary/60')}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Avatar className="size-12 rounded-xl">
          <AvatarImage
            src={courier.data?.profileImage}
            className="rounded-xl object-cover"
          />
          <AvatarFallback className="rounded-xl bg-primary font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-white">
            {getFullName(courier)}
            {highlighted && <span className="ml-2 text-xs text-primary">(you)</span>}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 capitalize">
              <TruckIcon className="size-3.5" /> {courier.data?.vehicle ?? '—'}
            </span>
            <span className="flex items-center gap-1">
              <PhoneIcon className="size-3.5" /> {courier.data?.phoneNumber ?? '—'}
            </span>
            <span className="flex items-center gap-1">
              <UsersIcon className="size-3.5" /> {customersCount}{' '}
              {customersCount === 1 ? 'customer' : 'customers'}
            </span>
          </div>
        </div>
        {action}
      </div>
      <WeeklySchedule schedule={courier.data?.workingDays} />
    </GlassCard>
  )
}

export default CourierCard
