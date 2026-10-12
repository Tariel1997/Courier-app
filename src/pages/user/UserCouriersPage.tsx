import EmptyState from '@/components/dashboard/EmptyState'
import BookCourierDialog from '@/features/bookings/components/BookCourierDialog'
import { useCouriers } from '@/features/cabinet/hooks/use-directory'
import CourierCard from '@/features/couriers/components/CourierCard'
import { countDistinctUsers } from '@/lib/booking-rules'
import { useBookingsStore } from '@/store/bookings.store'
import { BikeIcon } from 'lucide-react'

const UserCouriersPage = () => {
  const couriers = useCouriers()
  const bookings = useBookingsStore((state) => state.bookings)

  if (couriers.length === 0)
    return (
      <EmptyState
        icon={BikeIcon}
        title="No couriers yet"
        description="Couriers will appear here once they register."
      />
    )

  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
      {couriers.map((courier) => (
        <CourierCard
          key={courier.id}
          courier={courier}
          customersCount={countDistinctUsers(
            bookings.filter((booking) => booking.courierId === courier.id),
          )}
          action={<BookCourierDialog courier={courier} />}
        />
      ))}
    </div>
  )
}

export default UserCouriersPage
