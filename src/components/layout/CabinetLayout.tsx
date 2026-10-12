import { useCabinetData } from '@/features/cabinet/hooks/use-cabinet-data'
import { AlertCircleIcon, Loader2Icon } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import DashboardLayout, { type NavItem } from './DashboardLayout'

interface CabinetLayoutProps {
  navItems: NavItem[]
}

// Shared shell of every personal cabinet: navigation + data bootstrap
const CabinetLayout = ({ navItems }: CabinetLayoutProps) => {
  const { isLoading, error } = useCabinetData()

  return (
    <DashboardLayout navItems={navItems}>
      {error ? (
        <div
          role="alert"
          className="glass-card flex items-center gap-3 rounded-[1.25rem] p-5 text-sm text-destructive"
        >
          <AlertCircleIcon className="size-5 shrink-0" />
          {error}
        </div>
      ) : isLoading ? (
        <div className="glass-card flex items-center justify-center gap-3 rounded-[1.25rem] p-10 text-sm text-muted-foreground">
          <Loader2Icon className="size-5 animate-spin text-primary" />
          Loading…
        </div>
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  )
}

export default CabinetLayout
