import CabinetLayout from '@/components/layout/CabinetLayout'
import { ROUTES } from '@/config'
import AdminCourierDetailsPage from '@/pages/admin/AdminCourierDetailsPage'
import AdminCouriersPage from '@/pages/admin/AdminCouriersPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import CourierActivityPage from '@/pages/courier/CourierActivityPage'
import CourierDashboard from '@/pages/courier/CourierDashboard'
import ProfilePage from '@/pages/shared/ProfilePage'
import UserCouriersPage from '@/pages/user/UserCouriersPage'
import UserDashboard from '@/pages/user/UserDashboard'
import { ROLES } from '@/types/user.types'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ADMIN_NAV, COURIER_NAV, USER_NAV } from './cabinet-nav'
import { GuestRoute, ProtectedRoute } from './guards'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: <CabinetLayout navItems={ADMIN_NAV} />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: ROUTES.ADMIN_USERS, element: <AdminUsersPage /> },
          { path: ROUTES.ADMIN_COURIERS, element: <AdminCouriersPage /> },
          {
            path: ROUTES.ADMIN_COURIER_DETAILS(':courierId'),
            element: <AdminCourierDetailsPage />,
          },
          { path: ROUTES.ADMIN_PROFILE, element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.USER]} />,
    children: [
      {
        path: ROUTES.USER,
        element: <CabinetLayout navItems={USER_NAV} />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: ROUTES.USER_COURIERS, element: <UserCouriersPage /> },
          { path: ROUTES.USER_PROFILE, element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.COURIER]} />,
    children: [
      {
        path: ROUTES.COURIER,
        element: <CabinetLayout navItems={COURIER_NAV} />,
        children: [
          { index: true, element: <CourierDashboard /> },
          { path: ROUTES.COURIER_ACTIVITY, element: <CourierActivityPage /> },
          { path: ROUTES.COURIER_PROFILE, element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.LOGIN} replace /> },
])
