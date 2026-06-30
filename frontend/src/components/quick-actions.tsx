import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface QuickAction {
  label: string
  icon: LucideIcon
  href: string
  color?: string
}

interface QuickActionsProps {
  role: UserRole
  actions: QuickAction[]
}

const roleGradient: Record<UserRole, string> = {
  patient: 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-200/50',
  doctor: 'from-teal-500/10 to-blue-500/5 hover:from-teal-500/20 hover:to-blue-500/10 border-teal-200/50',
  admin: 'from-purple-500/10 to-blue-500/5 hover:from-purple-500/20 hover:to-blue-500/10 border-purple-200/50',
  ministry: 'from-blue-900/10 to-blue-800/5 hover:from-blue-900/20 hover:to-blue-800/10 border-blue-800/30',
}

export function QuickActions({ role, actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          to={action.href}
          className={cn(
            'group flex min-h-[4rem] flex-col items-center justify-center gap-2 rounded-2xl border bg-gradient-to-br p-4 text-center shadow-soft transition-all duration-200 hover:shadow-md',
            roleGradient[role],
          )}
          style={action.color ? { borderColor: action.color } : undefined}
        >
          <action.icon
            className="h-6 w-6"
            style={action.color ? { color: action.color } : undefined}
          />
          <span className="text-xs font-medium text-foreground">{action.label}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  )
}
