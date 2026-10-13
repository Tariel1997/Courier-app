import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-auth-actions'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { ROLE_LABELS } from '@/types/user.types'
import { LogOutIcon, PackageIcon, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  end?: boolean
}

interface DashboardLayoutProps {
  navItems: NavItem[]
  children: ReactNode
}

const isNavItemActive = (item: NavItem, pathname: string) =>
  pathname === item.to || (!item.end && pathname.startsWith(`${item.to}/`))

const DashboardLayout = ({ navItems, children }: DashboardLayoutProps) => {
  const user = useAuthStore((state) => state.user)
  const handleLogout = useLogout()
  const { pathname } = useLocation()

  if (!user) return null

  const title =
    navItems.find((item) => isNavItemActive(item, pathname))?.label ?? 'Cabinet'
  const initials =
    `${user.firstName[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="flex min-h-svh gap-6 bg-app p-4 lg:p-6">
      <aside className="glass-card sticky top-6 hidden h-[calc(100svh-3rem)] w-64 shrink-0 flex-col rounded-[1.25rem] p-5 lg:flex">
        <div className="flex items-center gap-3 pb-6 text-xs font-semibold tracking-[0.25em] text-white uppercase">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <PackageIcon className="size-4" />
          </span>
          Courier App
        </div>
        <div className="mb-6 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              active={isNavItemActive(item, pathname)}
            />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-[linear-gradient(135deg,#0075ff_0%,#4318ff_100%)] p-4">
          <p className="text-sm font-semibold text-white">Signed in as</p>
          <p className="mb-3 truncate text-xs text-white/70">{user.email}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="w-full rounded-xl bg-white/15 text-xs text-white hover:bg-white/25"
          >
            <LogOutIcon /> Log out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {ROLE_LABELS[user.role]} / <span className="text-white">{title}</span>
            </p>
            <h1 className="truncate text-lg font-semibold text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
            <Avatar className="size-10 rounded-xl">
              <AvatarImage
                src={user.data?.profileImage}
                className="rounded-xl object-cover"
              />
              <AvatarFallback className="rounded-xl bg-primary text-sm font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLogout}
              aria-label="Log out"
              className="text-muted-foreground hover:text-white lg:hidden"
            >
              <LogOutIcon />
            </Button>
          </div>
        </header>

        {/* Compact navigation for small screens */}
        <nav className="glass-card -mt-2 flex gap-1 overflow-x-auto rounded-2xl p-1.5 lg:hidden">
          {navItems.map(({ label, icon: Icon, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold',
                  isActive ? 'bg-primary text-white' : 'text-muted-foreground',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex flex-col gap-6">{children}</main>
      </div>
    </div>
  )
}

const SidebarLink = ({ item, active }: { item: NavItem; active: boolean }) => {
  const { label, icon: Icon, to } = item

  return (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-white/5 text-white shadow-[0_3.5px_5.5px_rgba(0,0,0,0.02)]'
          : 'text-muted-foreground hover:text-white',
      )}
    >
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-xl',
          active ? 'bg-primary text-white' : 'bg-field text-primary',
        )}
      >
        <Icon className="size-4" />
      </span>
      {label}
    </NavLink>
  )
}

export default DashboardLayout
