import SectionCard from '@/components/dashboard/SectionCard'
import AccountsTable, {
  type AccountColumn,
} from '@/features/admin/components/AccountsTable'
import CreateAccountDialog from '@/features/admin/components/CreateAccountDialog'
import { useAccountsByRole } from '@/features/cabinet/hooks/use-directory'
import { useBookingsStore } from '@/store/bookings.store'
import { ROLES } from '@/types/user.types'

const AdminUsersPage = () => {
  const users = useAccountsByRole(ROLES.USER)
  const bookings = useBookingsStore((state) => state.bookings)

  const columns: AccountColumn[] = [
    { header: 'Phone', render: (user) => user.data?.phoneNumber ?? '—' },
    { header: 'Personal ID', render: (user) => user.data?.pid ?? '—' },
    {
      header: 'Address',
      render: (user) => (
        <span className="line-clamp-2 max-w-56">{user.data?.address ?? '—'}</span>
      ),
    },
    {
      header: 'Bookings',
      render: (user) =>
        bookings.filter((booking) => booking.userId === user.id).length,
    },
  ]

  return (
    <SectionCard
      title="Users"
      description={`${users.length} registered customers`}
      action={<CreateAccountDialog role={ROLES.USER} />}
    >
      <AccountsTable accounts={users} columns={columns} />
    </SectionCard>
  )
}

export default AdminUsersPage
