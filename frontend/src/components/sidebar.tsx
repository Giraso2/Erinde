import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { UserRole } from '@/types'
import {
  Home,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  FileText,
  Bell,
  Calendar,
  LayoutDashboard,
  Users,
  Stethoscope,
  PiggyBank,
  Package,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  X,
  Search,
  ShieldCheck,
  UserPlus,
  Printer,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const navConfig: Record<UserRole, NavItem[]> = {
  patient: [
    { label: 'Home', href: '/patient', icon: Home },
    { label: 'Book Appointment', href: '/patient/book-appointment', icon: CalendarPlus },
    { label: 'My Queue', href: '/patient/my-queue', icon: ClipboardList },
    { label: 'Payments', href: '/patient/payments', icon: CreditCard },
    { label: 'Medical History', href: '/patient/medical-history', icon: FileText },
    { label: 'Notifications', href: '/patient/notifications', icon: Bell },
  ],
  doctor: [
    { label: 'Home', href: '/doctor', icon: Home },
    { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { label: 'Queue Management', href: '/doctor/queue-management', icon: ClipboardList },
    { label: 'Calendar', href: '/doctor/calendar', icon: Calendar },
    { label: 'Notifications', href: '/doctor/notifications', icon: Bell },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Queue Management', href: '/admin/queue-management', icon: ClipboardList },
    { label: 'Staff', href: '/admin/staff', icon: Users },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Finance', href: '/admin/finance', icon: PiggyBank },
    { label: 'Inventory', href: '/admin/inventory', icon: Package },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ],
  ministry: [
    { label: 'National Dashboard', href: '/ministry', icon: LayoutDashboard },
    { label: 'Analytics', href: '/ministry/analytics', icon: TrendingUp },
    { label: 'Alerts', href: '/ministry/alerts', icon: AlertTriangle },
    { label: 'Forecasts', href: '/ministry/forecasts', icon: TrendingUp },
  ],
  receptionist: [
    { label: 'Home', href: '/receptionist', icon: Home },
    { label: 'Verify Appointment', href: '/receptionist/verify', icon: Search },
    { label: 'Walk-in Registration', href: '/receptionist/walk-in', icon: UserPlus },
    { label: 'Queue Management', href: '/receptionist/queue', icon: ClipboardList },
    { label: 'Patient Search', href: '/receptionist/search', icon: Search },
    { label: 'Insurance Verification', href: '/receptionist/insurance', icon: ShieldCheck },
    { label: 'Payments', href: '/receptionist/payments', icon: CreditCard },
    { label: 'Doctor Availability', href: '/receptionist/doctors', icon: Stethoscope },
    { label: 'Notifications', href: '/receptionist/notifications', icon: Bell },
    { label: 'Reports', href: '/receptionist/reports', icon: BarChart3 },
  ],
}

const roleBadgeVariant: Record<UserRole, 'default' | 'secondary' | 'success' | 'warning' | 'error'> = {
  patient: 'secondary',
  doctor: 'success',
  admin: 'warning',
  ministry: 'error',
  receptionist: 'default',
}

interface SidebarProps {
  role: UserRole
  open: boolean
  onClose: () => void
}

export function Sidebar({ role, open, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const navItems = navConfig[role]

  const sidebarContent = (
    <div className="flex h-full flex-col" style={{ backgroundColor: '#0B1F4D' }}>
      <div className="flex items-center justify-between px-6 pt-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Erinde</h1>
          <p className="text-xs text-blue-300/70">Health Queue Management</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) onClose()
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border-l-4 border-secondary bg-secondary/20 text-white'
                  : 'border-l-4 border-transparent text-blue-200/70 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar size="md">
            <AvatarFallback name={user?.name ?? 'User'} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? 'User'}
            </p>
            <Badge variant={roleBadgeVariant[role]} className="mt-0.5 capitalize">
              {role}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
