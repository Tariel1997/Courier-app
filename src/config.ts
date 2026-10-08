const ENDPOINTS = {
  PRODUCTS: '/resource/products',
  PRODUCT_ID: (id: string) => `/resource/products/${id}`,

  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
}

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
}

const LOCALSTORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
}

export { ENDPOINTS, ROUTES, LOCALSTORAGE_KEYS }
