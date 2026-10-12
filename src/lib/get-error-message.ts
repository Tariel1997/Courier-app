import { AxiosError } from 'axios'

interface ApiErrorBody {
  message?: string | string[]
}

export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong',
) => {
  if (error instanceof AxiosError) {
    if (!error.response)
      return 'Server is unreachable. Make sure the API is running.'

    const { message } = (error.response.data ?? {}) as ApiErrorBody
    if (Array.isArray(message)) return message.join(', ')
    if (message) return message
  }

  if (error instanceof Error && error.message) return error.message
  return fallback
}
