import type { NavItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/config'
import {
  ActivityIcon,
  BikeIcon,
  LayoutDashboardIcon,
  UserCogIcon,
  UsersIcon,
} from 'lucide-react'

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, to: ROUTES.ADMIN, end: true },
  { label: 'Users', icon: UsersIcon, to: ROUTES.ADMIN_USERS },
  { label: 'Couriers', icon: BikeIcon, to: ROUTES.ADMIN_COURIERS },
  { label: 'Profile', icon: UserCogIcon, to: ROUTES.ADMIN_PROFILE },
]

export const USER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, to: ROUTES.USER, end: true },
  { label: 'Couriers', icon: BikeIcon, to: ROUTES.USER_COURIERS },
  { label: 'Profile', icon: UserCogIcon, to: ROUTES.USER_PROFILE },
]

export const COURIER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, to: ROUTES.COURIER, end: true },
  { label: 'Couriers activity', icon: ActivityIcon, to: ROUTES.COURIER_ACTIVITY },
  { label: 'Profile', icon: UserCogIcon, to: ROUTES.COURIER_PROFILE },
]
