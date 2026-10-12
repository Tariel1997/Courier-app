import { cn } from '@/lib/utils'
import { ROLE_LABELS, ROLE_LIST, type Role } from '@/types/user.types'
import { BikeIcon, ShieldCheckIcon, UserIcon, type LucideIcon } from 'lucide-react'

const ROLE_ICONS: Record<Role, LucideIcon> = {
  admin: ShieldCheckIcon,
  user: UserIcon,
  courier: BikeIcon,
}

interface RoleSwitcherProps {
  value: Role
  onChange: (role: Role) => void
}

const RoleSwitcher = ({ value, onChange }: RoleSwitcherProps) => (
  <div
    role="radiogroup"
    aria-label="Select role"
    className="grid grid-cols-3 gap-1 rounded-2xl border border-field-border bg-field p-1"
  >
    {ROLE_LIST.map((role) => {
      const Icon = ROLE_ICONS[role]
      const isActive = role === value

      return (
        <button
          key={role}
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => onChange(role)}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all',
            isActive
              ? 'bg-primary text-white shadow-[0_4px_14px_rgba(0,117,255,0.45)]'
              : 'text-muted-foreground hover:bg-white/5 hover:text-white',
          )}
        >
          <Icon className="size-4" />
          {ROLE_LABELS[role]}
        </button>
      )
    })}
  </div>
)

export default RoleSwitcher
