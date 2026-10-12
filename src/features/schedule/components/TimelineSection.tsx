import EmptyState from '@/components/dashboard/EmptyState'
import SectionCard from '@/components/dashboard/SectionCard'
import { useAccountMap, useCouriers } from '@/features/cabinet/hooks/use-directory'
import { useBookingsStore } from '@/store/bookings.store'
import { BikeIcon } from 'lucide-react'
import { useState } from 'react'

import CourierTimeline from './CourierTimeline'
import DatePickerButton from './DatePickerButton'

interface TimelineSectionProps {
  title?: string
  description?: string
  highlightCourierId?: number
}

// Day view of every courier's working and booked hours
const TimelineSection = ({
  title = 'Couriers activity',
  description = 'Working and booked hours of every courier on the selected day',
  highlightCourierId,
}: TimelineSectionProps) => {
  const [date, setDate] = useState(() => new Date())
  const couriers = useCouriers()
  const bookings = useBookingsStore((state) => state.bookings)
  const accountMap = useAccountMap()

  return (
    <SectionCard
      title={title}
      description={description}
      action={<DatePickerButton value={date} onChange={setDate} />}
    >
      {couriers.length === 0 ? (
        <EmptyState icon={BikeIcon} title="No couriers registered yet" />
      ) : (
        <CourierTimeline
          couriers={couriers}
          bookings={bookings}
          date={date}
          accountMap={accountMap}
          highlightCourierId={highlightCourierId}
        />
      )}
    </SectionCard>
  )
}

export default TimelineSection
