import { useState } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Notification } from '@/types'

const mockNotifications: Notification[] = [
  {
    id: 'n1', userId: 'u1', title: 'Appointment Reminder',
    message: 'You have a Cardiology appointment at CHUK tomorrow at 09:00.',
    type: 'appointment', read: false, createdAt: new Date().toISOString(),
  },
  {
    id: 'n2', userId: 'u1', title: 'Queue Update',
    message: 'Your position in Cardiology queue: #3. Estimated wait: 25 min.',
    type: 'queue', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n3', userId: 'u1', title: 'Payment Confirmed',
    message: 'Your payment of 15,000 RWF via MTN Mobile Money has been confirmed.',
    type: 'payment', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n4', userId: 'u1', title: 'Prescription Ready',
    message: 'Your prescription from Cardiology is ready for pickup at the Pharmacy.',
    type: 'medicine', read: false, createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

const typeIcons: Record<Notification['type'], string> = {
  appointment: '📅',
  queue: '🔄',
  payment: '💳',
  medicine: '💊',
  announcement: '📢',
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-xl"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-secondary hover:underline"
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className={cn(
                'flex flex-col items-start gap-1 px-3 py-2 cursor-pointer',
                !notif.read && 'bg-secondary/5',
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{typeIcons[notif.type]}</span>
                <span className={cn(
                  'text-sm',
                  !notif.read ? 'font-semibold text-foreground' : 'text-muted-foreground',
                )}>
                  {notif.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
                {notif.message}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
