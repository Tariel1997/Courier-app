import BaseForm from '@/components/form/BaseForm'
import AuthLayout from '@/components/layout/AuthLayout'
import { ROUTES } from '@/config'
import type { RegisterFormValues } from '@/features/auth/auth-form.types'
import RoleSwitcher from '@/features/auth/components/RoleSwitcher'
import { useRegister } from '@/features/auth/hooks/use-auth-actions'
import { useRoleParam } from '@/features/auth/hooks/use-role-param'
import { registerTemplates } from '@/features/auth/templates'
import { ROLE_LABELS } from '@/types/user.types'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  const [role, setRole] = useRoleParam()
  const { submit, error } = useRegister()

  return (
    <AuthLayout
      title="Welcome!"
      subtitle={`Create a new ${ROLE_LABELS[role].toLowerCase()} account`}
    >
      <div className="flex flex-col gap-6">
        <RoleSwitcher value={role} onChange={setRole} />

        {}
        <BaseForm<RegisterFormValues>
          key={role}
          fields={registerTemplates[role]}
          defaultValues={{ role }}
          onSubmit={submit}
          serverError={error}
          submitLabel="Sign up"
          footer={
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to={`${ROUTES.LOGIN}?role=${role}`}
                className="font-semibold text-white hover:text-primary"
              >
                Sign in
              </Link>
            </p>
          }
        />
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
