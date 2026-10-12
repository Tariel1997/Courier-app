import { LOCALSTORAGE_KEYS } from '@/config'

export interface Tokens {
  accessToken: string
  refreshToken: string
}

const tokenStorage = {
  getAccessToken: () => localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => localStorage.getItem(LOCALSTORAGE_KEYS.REFRESH_TOKEN),

  setTokens: ({ accessToken, refreshToken }: Tokens) => {
    localStorage.setItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(LOCALSTORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },

  clear: () => {
    localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(LOCALSTORAGE_KEYS.REFRESH_TOKEN)
  },
}

export default tokenStorage
