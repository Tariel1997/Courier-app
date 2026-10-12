import BaseForm from '@/components/form/BaseForm'
import AuthLayout from '@/components/layout/AuthLayout'
import { ROUTES } from '@/config'
import type { LoginFormValues } from '@/features/auth/auth-form.types'
import RoleSwitcher from '@/features/auth/components/RoleSwitcher'
import { useLogin } from '@/features/auth/hooks/use-auth-actions'
import { useRoleParam } from '@/features/auth/hooks/use-role-param'
import { loginTemplate } from '@/features/auth/templates'
import { ROLE_LABELS } from '@/types/user.types'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [role, setRole] = useRoleParam()
  const { submit, error } = useLogin()

  return (
    <AuthLayout
      title="Nice to see you!"
      subtitle={`Enter your email and password to sign in as ${ROLE_LABELS[role].toLowerCase()}`}
    >
      <div className="flex flex-col gap-6">
        <RoleSwitcher value={role} onChange={setRole} />

        <BaseForm<LoginFormValues>
          key={role}
          fields={loginTemplate}
          defaultValues={{ role }}
          onSubmit={submit}
          serverError={error}
          submitLabel="Sign in"
          footer={
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                to={`${ROUTES.REGISTER}?role=${role}`}
                className="font-semibold text-white hover:text-primary"
              >
                Sign up
              </Link>
            </p>
          }
        />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
