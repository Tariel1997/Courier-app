import { isRole, ROLES, type Role } from '@/types/user.types'
import { useSearchParams } from 'react-router-dom'

export const useRoleParam = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get('role')
  const role: Role = isRole(param) ? param : ROLES.USER

  const setRole = (next: Role) => setSearchParams({ role: next }, { replace: true })

  return [role, setRole] as const
}
