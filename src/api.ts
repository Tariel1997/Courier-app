import axios from 'axios'

import { ENDPOINTS, LOCALSTORAGE_KEYS } from './config'
import { refreshToken } from './service/auth/refresh'

const AUTH_PATHS = [ENDPOINTS.LOGIN, ENDPOINTS.REFRESH]
const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl: string = originalRequest?.url ?? ''
    const isAuthRequest = AUTH_PATHS.some((path) => requestUrl.includes(path))

    const shouldRefresh =
      error.response?.status === 401 && !originalRequest._retry && !isAuthRequest

    if (shouldRefresh) {
      originalRequest._retry = true

      try {
        const newAccessToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return $api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default $api
