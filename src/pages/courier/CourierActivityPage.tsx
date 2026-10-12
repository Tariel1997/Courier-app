import { useCouriers } from '@/features/cabinet/hooks/use-directory'
import CourierCard from '@/features/couriers/components/CourierCard'
import TimelineSection from '@/features/schedule/components/TimelineSection'
import { countDistinctUsers } from '@/lib/booking-rules'
import { useAuthStore } from '@/store/auth.store'
import { useBookingsStore } from '@/store/bookings.store'

const CourierActivityPage = () => {
  const userId = useAuthStore((state) => state.user?.id)
  const couriers = useCouriers()
  const bookings = useBookingsStore((state) => state.bookings)

  return (
    <>
      <TimelineSection highlightCourierId={userId} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        {couriers.map((courier) => (
          <CourierCard
            key={courier.id}
            courier={courier}
            highlighted={courier.id === userId}
            customersCount={countDistinctUsers(
              bookings.filter((booking) => booking.courierId === courier.id),
            )}
          />
        ))}
      </div>
    </>
  )
}

export default CourierActivityPage
