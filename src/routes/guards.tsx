import { ROLE_HOME_ROUTES, ROUTES } from '@/config'
import tokenStorage from '@/lib/token-storage'
import { useAuthStore } from '@/store/auth.store'
import type { Role } from '@/types/user.types'
import { Navigate, Outlet } from 'react-router-dom'

const useSessionUser = () => {
  const user = useAuthStore((state) => state.user)

  return user && tokenStorage.getAccessToken() ? user : null
}

interface ProtectedRouteProps {
  allowedRoles: Role[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useSessionUser()

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />
  if (!allowedRoles.includes(user.role))
    return <Navigate to={ROLE_HOME_ROUTES[user.role]} replace />

  return <Outlet />
}

export const GuestRoute = () => {
  const user = useSessionUser()
  return user ? <Navigate to={ROLE_HOME_ROUTES[user.role]} replace /> : <Outlet />
}
