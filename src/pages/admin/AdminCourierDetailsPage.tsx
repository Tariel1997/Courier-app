import EmptyState from '@/components/dashboard/EmptyState'
import ProfileCard from '@/components/dashboard/ProfileCard'
import SectionCard from '@/components/dashboard/SectionCard'
import StatCard from '@/components/dashboard/StatCard'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/config'
import BookingsTable from '@/features/bookings/components/BookingsTable'
import {
  useAccountMap,
  useCouriers,
  useSortedBookings,
} from '@/features/cabinet/hooks/use-directory'
import ProfileEditor from '@/features/profile/components/ProfileEditor'
import { courierScheduleTemplate } from '@/features/profile/profile-templates'
import WeeklySchedule from '@/features/schedule/components/WeeklySchedule'
import { countDistinctUsers } from '@/lib/booking-rules'
import { cn } from '@/lib/utils'
import { getFullName } from '@/types/user.types'
import {
  ArrowLeftIcon,
  CalendarCheckIcon,
  SearchXIcon,
  UsersIcon,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const AdminCourierDetailsPage = () => {
  const { courierId } = useParams()
  const couriers = useCouriers()
  const accountMap = useAccountMap()
  const allBookings = useSortedBookings()

  const courier = couriers.find((item) => item.id === Number(courierId))
  const backLink = (
    <Link
      to={ROUTES.ADMIN_COURIERS}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'w-fit text-white',
      )}
    >
      <ArrowLeftIcon /> All couriers
    </Link>
  )

  if (!courier)
    return (
      <>
        {backLink}
        <EmptyState icon={SearchXIcon} title="Courier not found" />
      </>
    )

  const bookings = allBookings.filter((booking) => booking.courierId === courier.id)
  const customers = [...new Set(bookings.map((booking) => booking.userId))]
    .map((userId) => accountMap.get(userId))
    .filter((account) => account !== undefined)

  return (
    <>
      {backLink}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Bookings"
          value={bookings.length}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Customers"
          value={countDistinctUsers(bookings)}
          icon={UsersIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-6">
          <ProfileCard
            user={courier}
            title={getFullName(courier)}
            extraRows={[
              {
                label: 'Vehicle',
                value: (
                  <span className="capitalize">{courier.data?.vehicle ?? '—'}</span>
                ),
              },
            ]}
          />
          <SectionCard title="Current schedule">
            <WeeklySchedule schedule={courier.data?.workingDays} />
          </SectionCard>
        </div>

        <ProfileEditor
          key={courier.id}
          account={courier}
          fields={courierScheduleTemplate}
          title="Edit working days & hours"
          description="Only the schedule of a courier can be changed by an admin"
          submitLabel="Save schedule"
        />
      </div>

      <SectionCard title="Customers" description="Users who booked this courier">
        {customers.length === 0 ? (
          <EmptyState icon={UsersIcon} title="Nobody has booked this courier yet" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {customers.map((customer) => (
              <span
                key={customer.id}
                className="rounded-xl bg-field px-3 py-2 text-sm text-white"
              >
                {getFullName(customer)}
                <span className="ml-2 text-xs text-muted-foreground">
                  {
                    bookings.filter((booking) => booking.userId === customer.id)
                      .length
                  }{' '}
                  bookings
                </span>
              </span>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Bookings" description="Every booking of this courier">
        <BookingsTable
          bookings={bookings}
          accountMap={accountMap}
          show={['user']}
          canCancel
        />
      </SectionCard>
    </>
  )
}

export default AdminCourierDetailsPage
