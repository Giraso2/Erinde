import { useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '': 'Home',
  'patient': 'Patient',
  'doctor': 'Doctor',
  'admin': 'Admin',
  'ministry': 'Ministry',
  'dashboard': 'Dashboard',
  'appointments': 'Appointments',
  'book-appointment': 'Book Appointment',
  'my-queue': 'My Queue',
  'payments': 'Payments',
  'medical-history': 'Medical History',
  'notifications': 'Notifications',
  'queue-management': 'Queue Management',
  'calendar': 'Calendar',
  'staff': 'Staff',
  'finance': 'Finance',
  'inventory': 'Inventory',
  'reports': 'Reports',
  'national-dashboard': 'National Dashboard',
  'analytics': 'Analytics',
  'alerts': 'Alerts',
  'forecasts': 'Forecasts',
}

export function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-secondary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = routeLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                to={href}
                className={cn(
                  'hover:text-secondary transition-colors',
                )}
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
