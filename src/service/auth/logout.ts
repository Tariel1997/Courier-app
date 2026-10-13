import $api from '@/api'
import { ENDPOINTS } from '@/config'
import tokenStorage from '@/lib/token-storage'

const logout = async () => {
  try {
    await $api.post(ENDPOINTS.LOGOUT)
  } finally {
    tokenStorage.clear()
  }
}

export default logout
