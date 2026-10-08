import $api from '@/api'
import { ENDPOINTS } from '@/config'
import { AxiosError } from 'axios'

import type { User } from './auth.types'

const getUser = async () => {
  try {
    const response = await $api.get(ENDPOINTS.ME)
    return response.data as User
  } catch (error) {
    if (error instanceof AxiosError) console.error('Backend error:', error.message)
    return undefined
  }
}

export default getUser
