import SectionCard from '@/components/dashboard/SectionCard'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/config'
import AccountsTable, {
  type AccountColumn,
} from '@/features/admin/components/AccountsTable'
import CreateAccountDialog from '@/features/admin/components/CreateAccountDialog'
import { useCouriers } from '@/features/cabinet/hooks/use-directory'
import { countDistinctUsers } from '@/lib/booking-rules'
import { getScheduleEntries } from '@/lib/schedule'
import { cn } from '@/lib/utils'
import { useBookingsStore } from '@/store/bookings.store'
import { ROLES } from '@/types/user.types'
import { CalendarCogIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminCouriersPage = () => {
  const couriers = useCouriers()
  const bookings = useBookingsStore((state) => state.bookings)
  const bookingsOf = (courierId: number) =>
    bookings.filter((booking) => booking.courierId === courierId)

  const columns: AccountColumn[] = [
    { header: 'Phone', render: (courier) => courier.data?.phoneNumber ?? '—' },
    {
      header: 'Vehicle',
      render: (courier) => (
        <span className="capitalize">{courier.data?.vehicle ?? '—'}</span>
      ),
    },
    {
      header: 'Working days',
      render: (courier) => (
        <div className="flex flex-wrap gap-1">
          {getScheduleEntries(courier.data?.workingDays).map(({ day }) => (
            <span
              key={day}
              className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary capitalize"
            >
              {day.slice(0, 3)}
            </span>
          ))}
        </div>
      ),
    },
    { header: 'Bookings', render: (courier) => bookingsOf(courier.id).length },
    {
      header: 'Customers',
      render: (courier) => countDistinctUsers(bookingsOf(courier.id)),
    },
  ]

  return (
    <SectionCard
      title="Couriers"
      description={`${couriers.length} couriers on the platform`}
      action={<CreateAccountDialog role={ROLES.COURIER} />}
    >
      <AccountsTable
        accounts={couriers}
        columns={columns}
        rowActions={(courier) => (
          <Link
            to={ROUTES.ADMIN_COURIER_DETAILS(courier.id)}
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-xl')}
          >
            <CalendarCogIcon /> Manage
          </Link>
        )}
      />
    </SectionCard>
  )
}

export default AdminCouriersPage
