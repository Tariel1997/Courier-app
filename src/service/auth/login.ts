import $api from '@/api'
import { ENDPOINTS, LOCALSTORAGE_KEYS } from '@/config'
import { AxiosError } from 'axios'

import type { LoginForm } from './auth.types'

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(LOCALSTORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

const login = async (data: LoginForm) => {
  const { email, password } = data

  try {
    const response = await $api.post(ENDPOINTS.LOGIN, { email, password })
    const { accessToken, refreshToken } = response.data.credentials ?? {}

    if (!accessToken || !refreshToken)
      throw new Error('Login response missing tokens')

    setTokens(accessToken, refreshToken)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) console.error('Backend error:', error.message)
    throw error
  }
}

export default login
