import $api from '@/api'
import { ENDPOINTS } from '@/config'

import type { AuthResponse, RegisterPayload } from '../auth/auth.types'
import { normalizeUser } from './get-users'

// Registers an account on behalf of an admin — the returned tokens are ignored
// so the admin's own session stays untouched
const createAccount = async (payload: RegisterPayload) => {
  const { data } = await $api.post<AuthResponse>(ENDPOINTS.REGISTER, payload)
  return normalizeUser(data.user)
}

export default createAccount
