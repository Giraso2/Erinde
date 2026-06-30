import { Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Breadcrumb } from '@/components/breadcrumb'
import { NotificationBell } from '@/components/notification-bell'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { UserRole } from '@/types'

const roleBadgeVariant: Record<UserRole, 'default' | 'secondary' | 'success' | 'warning' | 'error'> = {
  patient: 'secondary',
  doctor: 'success',
  admin: 'warning',
  ministry: 'error',
}

interface NavbarProps {
  toggleSidebar?: () => void
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logout } = useAuthStore()
  const isMobile = useMediaQuery('(max-width: 1023px)')

  return (
    <header className="glass fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 px-4 lg:left-64">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-9 w-9 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && (
          <span className="text-lg font-bold text-primary lg:hidden">
            Erinde
          </span>
        )}
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <LanguageSwitcher />
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-9 gap-2 rounded-xl px-2"
            >
              <Avatar size="sm">
                <AvatarFallback name={user?.name ?? 'U'} />
              </Avatar>
              {!isMobile && (
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-medium text-foreground">
                    {user?.name ?? 'User'}
                  </span>
                  {user?.role && (
                    <span className="text-[10px] capitalize text-muted-foreground">
                      {user.role}
                    </span>
                  )}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{user?.name ?? 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {user?.role && (
                  <Badge variant={roleBadgeVariant[user.role]} className="mt-1 w-fit capitalize">
                    {user.role}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-error focus:text-error"
              onClick={logout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
