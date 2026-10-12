import $api from '@/api'
import { ENDPOINTS } from '@/config'
import tokenStorage from '@/lib/token-storage'

const logout = async () => {
  try {
    await $api.post(ENDPOINTS.LOGOUT)
  } finally {
    // Local session is always cleared, even if the backend call fails
    tokenStorage.clear()
  }
}

export default logout
