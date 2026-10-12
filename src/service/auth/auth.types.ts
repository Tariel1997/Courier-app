import type { Tokens } from '@/lib/token-storage'
import type { Role, User, UserProfileData } from '@/types/user.types'

export type { User }

// Login types

export interface LoginPayload {
  email: string
  password: string
  role: Role
}

// Register types

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: Role
  data: UserProfileData
}

// Shared auth response (login / register / refresh)

export interface AuthResponse {
  user: User
  credentials: Tokens & { userId: number; expiredAt: string }
}

export interface RefreshTokenResponse {
  credentials: Tokens
}
