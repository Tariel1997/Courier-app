import { isRole, ROLES, type Role } from '@/types/user.types'
import { useSearchParams } from 'react-router-dom'

// Selected role lives in the URL (?role=courier) so it survives reloads and can be linked
export const useRoleParam = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get('role')
  const role: Role = isRole(param) ? param : ROLES.USER

  const setRole = (next: Role) => setSearchParams({ role: next }, { replace: true })

  return [role, setRole] as const
}
