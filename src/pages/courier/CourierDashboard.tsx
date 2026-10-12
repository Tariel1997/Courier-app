import ProfileCard from '@/components/dashboard/ProfileCard'
import SectionCard from '@/components/dashboard/SectionCard'
import StatCard from '@/components/dashboard/StatCard'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import BookingsTable from '@/features/bookings/components/BookingsTable'
import {
  useAccountMap,
  useSortedBookings,
} from '@/features/cabinet/hooks/use-directory'
import WeeklySchedule from '@/features/schedule/components/WeeklySchedule'
import { countDistinctUsers, isUpcoming } from '@/lib/booking-rules'
import { getScheduleEntries } from '@/lib/schedule'
import { useAuthStore } from '@/store/auth.store'
import { CalendarCheckIcon, ClockIcon, RouteIcon, UsersIcon } from 'lucide-react'

const CourierDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const allBookings = useSortedBookings()
  const accountMap = useAccountMap()

  if (!user) return null

  const bookings = allBookings.filter((booking) => booking.courierId === user.id)
  const upcoming = bookings.filter((booking) => isUpcoming(booking))
  const workingDays = getScheduleEntries(user.data?.workingDays)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={bookings.length}
          icon={CalendarCheckIcon}
        />
        <StatCard label="Upcoming" value={upcoming.length} icon={ClockIcon} />
        <StatCard
          label="Customers"
          value={countDistinctUsers(bookings)}
          hint="in total"
          icon={UsersIcon}
        />
        <StatCard
          label="Working days / week"
          value={workingDays.length}
          icon={RouteIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <WelcomeCard
          name={user.firstName}
          message="Ready for the road? Your bookings and schedule are below."
        />
        <ProfileCard
          user={user}
          extraRows={[
            {
              label: 'Vehicle',
              value: <span className="capitalize">{user.data?.vehicle ?? '—'}</span>,
            },
          ]}
        />
      </div>

      <SectionCard
        title="Weekly schedule"
        description="Days and hours you are available"
      >
        <WeeklySchedule schedule={user.data?.workingDays} />
      </SectionCard>

      <SectionCard title="My bookings" description="Users who booked you">
        <BookingsTable
          bookings={bookings}
          accountMap={accountMap}
          show={['user']}
          emptyText="Nobody has booked you yet"
        />
      </SectionCard>
    </>
  )
}

export default CourierDashboard
