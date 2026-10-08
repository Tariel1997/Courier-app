// User types

export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

// Login types

export interface LoginForm {
  email: string
  password: string
}

// Refresh token types

export interface RefreshTokenResponse {
  credentials: {
    accessToken: string
    refreshToken: string
  }
}
