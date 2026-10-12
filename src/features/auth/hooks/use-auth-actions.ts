import { ROLE_HOME_ROUTES, ROUTES } from '@/config'
import { getErrorMessage } from '@/lib/get-error-message'
import tokenStorage from '@/lib/token-storage'
import login from '@/service/auth/login'
import logout from '@/service/auth/logout'
import register from '@/service/auth/register'
import {
  applyProfileOverride,
  getProfileOverride,
} from '@/service/profiles/profiles.service'
import { normalizeUser } from '@/service/users/get-users'
import { useAccountsStore } from '@/store/accounts.store'
import { useAuthStore } from '@/store/auth.store'
import { useBookingsStore } from '@/store/bookings.store'
import type { User } from '@/types/user.types'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { LoginFormValues, RegisterFormValues } from '../auth-form.types'
import { toRegisterPayload } from '../mappers/register.mapper'

const useSessionStart = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  return (user: User) => {
    // Never show data cached from a previous session
    useAccountsStore.getState().reset()
    useBookingsStore.getState().reset()
    setUser(user)
    navigate(ROLE_HOME_ROUTES[user.role], { replace: true })
  }
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const startSession = useSessionStart()

  const submit = async (values: LoginFormValues) => {
    setError(null)
    try {
      const { user } = await login(values)
      const override = await getProfileOverride(user.id)

      if (override?.deleted) {
        tokenStorage.clear()
        setError('This account has been removed by an administrator')
        return
      }

      startSession(applyProfileOverride(normalizeUser(user), override))
    } catch (err) {
      const isUnauthorized =
        err instanceof AxiosError && err.response?.status === 401
      setError(
        isUnauthorized
          ? 'Invalid email, password or role'
          : getErrorMessage(err, 'Login failed'),
      )
    }
  }

  return { submit, error }
}

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null)
  const startSession = useSessionStart()

  const submit = async (values: RegisterFormValues) => {
    setError(null)
    try {
      const { user } = await register(toRegisterPayload(values))
      startSession(user)
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'))
    }
  }

  return { submit, error }
}

export const useLogout = () => {
  const navigate = useNavigate()
  const clearSession = useAuthStore((state) => state.clearSession)

  return useCallback(async () => {
    try {
      await logout()
    } finally {
      clearSession()
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [clearSession, navigate])
}
