import ProfileCard from '@/components/dashboard/ProfileCard'
import SectionCard from '@/components/dashboard/SectionCard'
import StatCard from '@/components/dashboard/StatCard'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/config'
import BookingsTable from '@/features/bookings/components/BookingsTable'
import {
  useAccountMap,
  useCouriers,
  useSortedBookings,
} from '@/features/cabinet/hooks/use-directory'
import { isUpcoming } from '@/lib/booking-rules'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import {
  BikeIcon,
  CalendarCheckIcon,
  CircleCheckIcon,
  ClockIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const couriers = useCouriers()
  const allBookings = useSortedBookings()
  const accountMap = useAccountMap()

  if (!user) return null

  const myBookings = allBookings.filter((booking) => booking.userId === user.id)
  const upcoming = myBookings.filter((booking) => isUpcoming(booking))

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Upcoming bookings"
          value={upcoming.length}
          icon={ClockIcon}
        />
        <StatCard
          label="Completed"
          value={myBookings.length - upcoming.length}
          icon={CircleCheckIcon}
        />
        <StatCard
          label="Available couriers"
          value={couriers.length}
          icon={BikeIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <WelcomeCard
          name={user.firstName}
          message={
            <div className="flex flex-col items-start gap-4">
              Need something delivered? Pick a courier and a free time slot.
              <Link
                to={ROUTES.USER_COURIERS}
                className={cn(buttonVariants({ size: 'sm' }), 'rounded-xl')}
              >
                <CalendarCheckIcon /> Book a courier
              </Link>
            </div>
          }
        />
        <ProfileCard
          user={user}
          extraRows={[{ label: 'Address', value: user.data?.address ?? '—' }]}
        />
      </div>

      <SectionCard title="My bookings" description="Couriers you have booked">
        <BookingsTable
          bookings={myBookings}
          accountMap={accountMap}
          show={['courier']}
          canCancel
          emptyText="You haven't booked any courier yet"
        />
      </SectionCard>
    </>
  )
}

export default UserDashboard
