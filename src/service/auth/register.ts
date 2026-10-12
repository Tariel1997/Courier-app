import $api from '@/api'
import { ENDPOINTS } from '@/config'
import tokenStorage from '@/lib/token-storage'

import type { AuthResponse, RegisterPayload } from './auth.types'

const register = async (payload: RegisterPayload) => {
  const { data } = await $api.post<AuthResponse>(ENDPOINTS.REGISTER, payload)
  const { accessToken, refreshToken } = data.credentials ?? {}

  if (!accessToken || !refreshToken)
    throw new Error('Register response missing tokens')

  tokenStorage.setTokens({ accessToken, refreshToken })
  return data
}

export default register
