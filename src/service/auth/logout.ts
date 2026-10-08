import $api from '@/api'
import { ENDPOINTS, LOCALSTORAGE_KEYS } from '@/config'
import { AxiosError } from 'axios'

const logout = async () => {
  try {
    const response = await $api.post(ENDPOINTS.LOGOUT)
    if (response.data) {
      localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(LOCALSTORAGE_KEYS.REFRESH_TOKEN)
    }
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) console.error('Backend error:', error.message)
    throw error
  }
}

export default logout
