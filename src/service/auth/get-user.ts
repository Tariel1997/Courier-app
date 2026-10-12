import $api from '@/api'
import { ENDPOINTS } from '@/config'

import type { User } from './auth.types'

const getUser = async () => {
  const { data } = await $api.get<User>(ENDPOINTS.ME)
  return data
}

export default getUser
