import ProfileCard from '@/components/dashboard/ProfileCard'
import SectionCard from '@/components/dashboard/SectionCard'
import StatCard from '@/components/dashboard/StatCard'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import BookingsTable from '@/features/bookings/components/BookingsTable'
import {
  useAccountMap,
  useAccountsByRole,
  useSortedBookings,
} from '@/features/cabinet/hooks/use-directory'
import TimelineSection from '@/features/schedule/components/TimelineSection'
import { isUpcoming } from '@/lib/booking-rules'
import { useAuthStore } from '@/store/auth.store'
import { ROLES } from '@/types/user.types'
import { BikeIcon, CalendarCheckIcon, ClockIcon, UsersIcon } from 'lucide-react'

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const users = useAccountsByRole(ROLES.USER)
  const couriers = useAccountsByRole(ROLES.COURIER)
  const bookings = useSortedBookings()
  const accountMap = useAccountMap()

  if (!user) return null

  const upcoming = bookings.filter((booking) => isUpcoming(booking))

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={users.length} icon={UsersIcon} />
        <StatCard label="Couriers" value={couriers.length} icon={BikeIcon} />
        <StatCard
          label="All bookings"
          value={bookings.length}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Upcoming bookings"
          value={upcoming.length}
          icon={ClockIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <WelcomeCard
          name={user.firstName}
          message="You manage users, couriers and their working schedules."
        />
        <ProfileCard user={user} />
      </div>

      <TimelineSection />

      <SectionCard title="Upcoming bookings" description="Who booked which courier">
        <BookingsTable
          bookings={upcoming}
          accountMap={accountMap}
          show={['courier', 'user']}
          canCancel
          emptyText="No upcoming bookings"
        />
      </SectionCard>
    </>
  )
}

export default AdminDashboard
