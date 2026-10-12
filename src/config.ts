import { ROLES, type Role } from '@/types/user.types'

const ENDPOINTS = {
  RESOURCE: (resource: string) => `/resource/${resource}`,
  RESOURCE_ID: (resource: string, id: string) => `/resource/${resource}/${id}`,

  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  USERS: '/users',
}

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURIERS: '/admin/couriers',
  ADMIN_COURIER_DETAILS: (id: number | string) => `/admin/couriers/${id}`,
  ADMIN_PROFILE: '/admin/profile',
  USER: '/user',
  USER_COURIERS: '/user/couriers',
  USER_PROFILE: '/user/profile',
  COURIER: '/courier',
  COURIER_ACTIVITY: '/courier/activity',
  COURIER_PROFILE: '/courier/profile',
}

const ROLE_HOME_ROUTES: Record<Role, string> = {
  [ROLES.ADMIN]: ROUTES.ADMIN,
  [ROLES.USER]: ROUTES.USER,
  [ROLES.COURIER]: ROUTES.COURIER,
}

const LOCALSTORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  AUTH_STORE: 'auth_store',
}

export { ENDPOINTS, ROUTES, ROLE_HOME_ROUTES, LOCALSTORAGE_KEYS }
