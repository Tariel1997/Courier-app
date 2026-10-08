import { ENDPOINTS, LOCALSTORAGE_KEYS, ROUTES } from '@/config'
import axios from 'axios'

import type { RefreshTokenResponse } from './auth.types'

let refreshTokenPromise: Promise<string> | null = null

export async function refreshToken(): Promise<string> {
  if (!refreshTokenPromise) refreshTokenPromise = handleRefresh()
  return refreshTokenPromise
}

async function handleRefresh(): Promise<string> {
  try {
    const storedRefreshToken = localStorage.getItem('refresh_token')
    if (!storedRefreshToken) throw new Error('No refresh token available')

    const { data } = (await axios.post(
      `${import.meta.env.VITE_API_URL}${ENDPOINTS.REFRESH}`,
      { token: storedRefreshToken },
    )) as { data: RefreshTokenResponse }

    localStorage.setItem(
      LOCALSTORAGE_KEYS.ACCESS_TOKEN,
      data.credentials.accessToken,
    )
    if (data.credentials.refreshToken)
      localStorage.setItem(
        LOCALSTORAGE_KEYS.REFRESH_TOKEN,
        data.credentials.refreshToken,
      )

    return data.credentials.accessToken
  } catch (error) {
    localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(LOCALSTORAGE_KEYS.REFRESH_TOKEN)
    if (window.location.pathname !== ROUTES.LOGIN)
      window.location.href = ROUTES.LOGIN
    throw error
  } finally {
    refreshTokenPromise = null
  }
}
