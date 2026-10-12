import { PackageIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="flex min-h-svh bg-app">
    <aside className="relative hidden w-[45%] overflow-hidden lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1e3aff_0%,transparent_45%),radial-gradient(circle_at_80%_80%,#7928ca_0%,transparent_40%),linear-gradient(160deg,#0b1048_0%,#060b26_100%)]" />
      <div className="absolute top-1/4 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative z-10 flex w-full flex-col justify-between p-12">
        <Brand />
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-[0.3em] text-white/60 uppercase">
            Inspired by the future:
          </p>
          <h2 className="font-heading text-4xl leading-tight font-bold text-white xl:text-5xl">
            Deliver faster.
            <br />
            <span className="bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              Track everything.
            </span>
          </h2>
          <p className="max-w-sm text-sm text-white/60">
            One platform for admins, customers and couriers — each with a personal
            workspace.
          </p>
        </div>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Courier App
        </p>
      </div>
    </aside>

    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-xl">
        <div className="mb-8 lg:hidden">
          <Brand />
        </div>
        <div className="glass-card rounded-[1.5rem] p-6 sm:p-10">
          <div className="mb-8 space-y-2">
            <h1 className="font-heading text-3xl font-bold text-white">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  </div>
)

const Brand = () => (
  <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.25em] text-white uppercase">
    <span className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-[0_4px_14px_rgba(0,117,255,0.45)]">
      <PackageIcon className="size-5" />
    </span>
    Courier App
  </div>
)

export default AuthLayout
