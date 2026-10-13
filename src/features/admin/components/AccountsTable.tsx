import ConfirmButton from '@/components/dashboard/ConfirmButton'
import EmptyState from '@/components/dashboard/EmptyState'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAccountsStore } from '@/store/accounts.store'
import { useBookingsStore } from '@/store/bookings.store'
import { getFullName, ROLE_LABELS, type User } from '@/types/user.types'
import { Trash2Icon, UsersIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface AccountColumn {
  header: string
  render: (account: User) => ReactNode
}

interface AccountsTableProps {
  accounts: User[]
  columns: AccountColumn[]
  rowActions?: (account: User) => ReactNode
}

const AccountsTable = ({ accounts, columns, rowActions }: AccountsTableProps) => {
  const deleteAccount = useAccountsStore((state) => state.deleteAccount)
  const forgetAccount = useBookingsStore((state) => state.forgetAccount)

  if (accounts.length === 0)
    return <EmptyState icon={UsersIcon} title="Nobody here yet" />

  const remove = async (account: User) => {
    await deleteAccount(account.id)
    forgetAccount(account.id)
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-2xl">
        <TableHeader>
          <TableRow className="border-white/10 text-[11px] tracking-wider uppercase hover:bg-transparent">
            <TableHead className="text-muted-foreground">Account</TableHead>
            {columns.map((column) => (
              <TableHead key={column.header} className="text-muted-foreground">
                {column.header}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id} className="border-white/5">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 rounded-xl">
                    <AvatarImage
                      src={account.data?.profileImage}
                      className="rounded-xl object-cover"
                    />
                    <AvatarFallback className="rounded-xl bg-primary text-xs font-semibold text-white">
                      {account.firstName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-white">{getFullName(account)}</p>
                    <p className="text-xs text-muted-foreground">{account.email}</p>
                  </div>
                </div>
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.header} className="text-muted-foreground">
                  {column.render(account)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex justify-end gap-2">
                  {rowActions?.(account)}
                  <ConfirmButton
                    label="Delete"
                    icon={Trash2Icon}
                    title={`Delete ${getFullName(account)}?`}
                    description={`The ${ROLE_LABELS[account.role].toLowerCase()} loses access to the platform and all related bookings are removed.`}
                    confirmLabel="Delete"
                    onConfirm={() => remove(account)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AccountsTable
