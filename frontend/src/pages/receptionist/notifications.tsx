import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  UserCheck,
  XCircle,
  AlertTriangle,
  Clock,
  ListOrdered,
  CreditCard,
  CheckCheck,
  MailOpen,
  Mail,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'

interface NotificationItem {
  id: string
  icon: typeof Bell
  iconBg: string
  iconColor: string
  title: string
  message: string
  timeAgo: string
  read: boolean
  type: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1', icon: UserCheck, iconBg: 'bg-success/10', iconColor: 'text-success',
    title: 'Patient Arrived',
    message: 'Alice Uwimana has arrived for her Cardiology appointment at 09:00.',
    timeAgo: '2 min ago', read: false, type: 'arrival',
  },
  {
    id: 'n2', icon: XCircle, iconBg: 'bg-error/10', iconColor: 'text-error',
    title: 'Appointment Cancelled',
    message: 'Patrick Habimana cancelled his Maternity appointment scheduled for 11:00.',
    timeAgo: '5 min ago', read: false, type: 'cancellation',
  },
  {
    id: 'n3', icon: AlertTriangle, iconBg: 'bg-error/10', iconColor: 'text-error',
    title: 'Emergency Patient Arriving',
    message: 'Ambulance en route with a critical patient. Emergency team requested.',
    timeAgo: '8 min ago', read: false, type: 'emergency',
  },
  {
    id: 'n4', icon: Clock, iconBg: 'bg-warning/10', iconColor: 'text-warning',
    title: 'Doctor Delay',
    message: 'Dr. Jean Damascene is running 15 minutes behind schedule in Cardiology.',
    timeAgo: '12 min ago', read: false, type: 'delay',
  },
  {
    id: 'n5', icon: ListOrdered, iconBg: 'bg-secondary/10', iconColor: 'text-secondary',
    title: 'Queue Update',
    message: 'General Consultation queue is now moving. 3 patients ahead before your turn.',
    timeAgo: '15 min ago', read: true, type: 'queue',
  },
  {
    id: 'n6', icon: CreditCard, iconBg: 'bg-success/10', iconColor: 'text-success',
    title: 'Payment Confirmed',
    message: 'Payment of 15,000 RWF via MTN Mobile Money confirmed for Marie Claire Uwase.',
    timeAgo: '20 min ago', read: true, type: 'payment',
  },
  {
    id: 'n7', icon: UserCheck, iconBg: 'bg-success/10', iconColor: 'text-success',
    title: 'Patient Arrived',
    message: 'Jean Marie Vianney has arrived for his General Consultation appointment.',
    timeAgo: '25 min ago', read: true, type: 'arrival',
  },
  {
    id: 'n8', icon: Clock, iconBg: 'bg-warning/10', iconColor: 'text-warning',
    title: 'Doctor Delay',
    message: 'Dr. Eric Niyonzima is running 10 minutes behind in Emergency.',
    timeAgo: '30 min ago', read: true, type: 'delay',
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(initialNotifications)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => !n.read)

  const unreadCount = notifications.filter((n) => !n.read).length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with reception events and alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-secondary/10 p-1">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="gap-1.5"
            >
              <MailOpen className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="gap-1.5"
            >
              <Mail className="h-4 w-4" />
              Unread
              {unreadCount > 0 && (
                <Badge variant="error" className="ml-0.5 h-5 w-5 rounded-full p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
          description={
            filter === 'unread'
              ? 'You have read all notifications.'
              : 'There are no notifications to display.'
          }
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence>
            {filtered.map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                layout
                onClick={() => markAsRead(notification.id)}
                className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
                  notification.read
                    ? 'border-border bg-card'
                    : 'border-secondary/20 bg-gradient-to-r from-secondary/[0.03] to-card'
                }`}
              >
                {!notification.read && (
                  <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-secondary" />
                )}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${notification.iconBg}`}
                >
                  <notification.icon className={`h-6 w-6 ${notification.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm ${
                        notification.read ? 'font-medium text-foreground' : 'font-semibold text-foreground'
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {notification.timeAgo}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}
