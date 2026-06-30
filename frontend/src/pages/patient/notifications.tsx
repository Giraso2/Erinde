import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Calendar,
  Users,
  CreditCard,
  Pill,
  Megaphone,
  CheckCheck,
  Clock,
  Loader2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { usePatientData } from '@/hooks/use-mock-data'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Notification } from '@/types'

const typeIcons: Record<string, typeof Bell> = {
  appointment: Calendar,
  queue: Users,
  payment: CreditCard,
  medicine: Pill,
  announcement: Megaphone,
}

const typeColors: Record<string, string> = {
  appointment: 'text-secondary bg-secondary/10',
  queue: 'text-warning bg-warning/10',
  payment: 'text-success bg-success/10',
  medicine: 'text-primary bg-primary/10',
  announcement: 'text-foreground bg-accent',
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function PatientNotifications() {
  const { notifications } = usePatientData()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [localNotifs, setLocalNotifs] = useState<Notification[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalNotifs(notifications ?? [])
      setLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [notifications])

  const unread = useMemo(() => localNotifs.filter((n) => !n.read), [localNotifs])
  const displayNotifs = tab === 'unread' ? unread : localNotifs

  function markAsRead(id: string) {
    setLocalNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function markAllAsRead() {
    setLocalNotifs((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">Stay updated with your health activities</p>
        </div>
        <LoadingSkeleton type="list" count={4} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">Stay updated with your health activities</p>
        </div>
        {unread.length > 0 && (
          <Button variant="ghost" size="sm" className="gap-2 text-secondary" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All
            <Badge variant="default" className="ml-1.5 bg-secondary/20 text-secondary">
              {localNotifs.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unread.length > 0 && (
              <Badge variant="warning" className="ml-1.5">
                {unread.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <NotificationList
            notifications={displayNotifs}
            onMarkRead={markAsRead}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <NotificationList
            notifications={displayNotifs}
            onMarkRead={markAsRead}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function NotificationList({
  notifications,
  onMarkRead,
}: {
  notifications: Notification[]
  onMarkRead: (id: string) => void
}) {
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="You're all caught up! New notifications will appear here."
      />
    )
  }

  return (
    <div className="space-y-2">
      {notifications.map((notif, index) => {
        const Icon = typeIcons[notif.type] ?? Bell
        const colorClass = typeColors[notif.type] ?? 'text-secondary bg-secondary/10'
        return (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => !notif.read && onMarkRead(notif.id)}
            className={`group cursor-pointer rounded-2xl border p-4 shadow-soft transition-all hover:shadow-md ${
              notif.read
                ? 'border-border bg-card'
                : 'border-secondary/20 bg-secondary/[0.03]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`text-sm ${
                        notif.read ? 'font-medium text-foreground' : 'font-semibold text-foreground'
                      }`}
                    >
                      {notif.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {notif.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-secondary" />
                    )}
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {timeAgo(notif.createdAt)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
