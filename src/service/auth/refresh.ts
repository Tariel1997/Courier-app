import { ENDPOINTS, ROUTES } from '@/config'
import tokenStorage from '@/lib/token-storage'
import { useAuthStore } from '@/store/auth.store'
import axios from 'axios'

import type { RefreshTokenResponse } from './auth.types'

let refreshTokenPromise: Promise<string> | null = null

export async function refreshToken(): Promise<string> {
  if (!refreshTokenPromise) refreshTokenPromise = handleRefresh()
  return refreshTokenPromise
}

async function handleRefresh(): Promise<string> {
  try {
    const storedRefreshToken = tokenStorage.getRefreshToken()
    if (!storedRefreshToken) throw new Error('No refresh token available')

    const { data } = await axios.post<RefreshTokenResponse>(
      `${import.meta.env.VITE_API_URL}${ENDPOINTS.REFRESH}`,
      { token: storedRefreshToken },
    )

    tokenStorage.setTokens({
      accessToken: data.credentials.accessToken,
      refreshToken: data.credentials.refreshToken ?? storedRefreshToken,
    })

    return data.credentials.accessToken
  } catch (error) {
    tokenStorage.clear()
    useAuthStore.getState().clearSession()
    if (window.location.pathname !== ROUTES.LOGIN)
      window.location.href = ROUTES.LOGIN
    throw error
  } finally {
    refreshTokenPromise = null
  }
}
