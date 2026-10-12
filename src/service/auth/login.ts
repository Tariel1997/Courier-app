import $api from '@/api'
import { ENDPOINTS } from '@/config'
import tokenStorage from '@/lib/token-storage'

import type { AuthResponse, LoginPayload } from './auth.types'

const login = async (payload: LoginPayload) => {
  const { data } = await $api.post<AuthResponse>(ENDPOINTS.LOGIN, payload)
  const { accessToken, refreshToken } = data.credentials ?? {}

  if (!accessToken || !refreshToken) throw new Error('Login response missing tokens')

  tokenStorage.setTokens({ accessToken, refreshToken })
  return data
}

export default login
