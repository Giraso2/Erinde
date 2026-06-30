import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  ClipboardCheck,
  UserPlus,
  CalendarClock,
  ListOrdered,
  Stethoscope,
  AlertTriangle,
  Clock,
  SearchCheck,
  Printer,
  ArrowRight,
  Bell,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stats = [
  { title: 'Patients Waiting', value: 24, icon: Users, variant: 'default' as const, trend: 8 },
  { title: 'Checked In Today', value: 87, icon: ClipboardCheck, variant: 'success' as const, trend: 12 },
  { title: 'Walk-ins Today', value: 31, icon: UserPlus, variant: 'warning' as const, trend: -5 },
  { title: 'Upcoming Appointments', value: 53, icon: CalendarClock, variant: 'default' as const, trend: 3 },
  { title: 'Current Queue', value: 42, icon: ListOrdered, variant: 'default' as const, trend: 0 },
  { title: 'Available Doctors', value: 8, icon: Stethoscope, variant: 'success' as const, trend: 2 },
  { title: 'Emergency Cases', value: 3, icon: AlertTriangle, variant: 'error' as const, trend: 1 },
]

const quickActions = [
  { label: 'Register New Patient', icon: UserPlus, color: 'bg-primary text-white hover:bg-primary/90', href: '/receptionist/walk-in' },
  { label: 'Check In Patient', icon: ClipboardCheck, color: 'bg-secondary text-white hover:bg-secondary/90', href: '/receptionist/verify' },
  { label: 'Verify Appointment', icon: SearchCheck, color: 'bg-white text-foreground border border-border hover:bg-accent', href: '/receptionist/verify' },
  { label: 'Add Walk-in Patient', icon: UserPlus, color: 'bg-warning text-white hover:bg-warning/90', href: '/receptionist/walk-in' },
  { label: 'Print Queue Ticket', icon: Printer, color: 'bg-white text-foreground border border-border hover:bg-accent', href: '/receptionist/queue' },
  { label: 'Redirect Patient', icon: ArrowRight, color: 'bg-white text-foreground border border-border hover:bg-accent', href: '/receptionist/queue' },
]

const recentActivity = [
  { icon: User, text: 'Alice Uwimana checked in for Cardiology', time: '2 min ago', type: 'checkin' },
  { icon: Calendar, text: 'Appointment verified for Jean Marie Vianney', time: '5 min ago', type: 'verify' },
  { icon: UserPlus, text: 'New walk-in registered: Frida Mukamana', time: '8 min ago', type: 'walkin' },
  { icon: FileText, text: 'Queue ticket printed for Eric Mugisha', time: '12 min ago', type: 'ticket' },
  { icon: CheckCircle2, text: 'Payment confirmed for Marie Claire Uwase', time: '15 min ago', type: 'payment' },
  { icon: XCircle, text: 'Appointment cancelled: Patrick Habimana', time: '20 min ago', type: 'cancel' },
  { icon: Timer, text: 'Emergency case assigned: Diane Umubyeyi', time: '25 min ago', type: 'emergency' },
  { icon: Bell, text: 'Dr. Jean Damascene reported 10 min delay', time: '30 min ago', type: 'delay' },
]

function getActivityColor(type: string) {
  switch (type) {
    case 'checkin': return 'bg-success/10 text-success'
    case 'verify': return 'bg-secondary/10 text-secondary'
    case 'walkin': return 'bg-warning/10 text-warning'
    case 'ticket': return 'bg-primary/10 text-primary'
    case 'payment': return 'bg-success/10 text-success'
    case 'cancel': return 'bg-error/10 text-error'
    case 'emergency': return 'bg-error/10 text-error'
    case 'delay': return 'bg-warning/10 text-warning'
    default: return 'bg-muted/10 text-muted'
  }
}

export default function ReceptionistHome() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Receptionist Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Here is your front desk overview for today.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Badge>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
            trend={stat.trend}
            description="vs yesterday"
          />
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  const isPrimary = action.color.includes('bg-primary') || action.color.includes('bg-secondary') || action.color.includes('bg-warning')
                  return (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex min-h-[5rem] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-sm font-medium shadow-soft transition-all duration-200 ${
                        isPrimary ? action.color : action.color + ' hover:shadow-md'
                      }`}
                      onClick={() => {}}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{action.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/5"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
