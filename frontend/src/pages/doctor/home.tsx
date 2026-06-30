import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CalendarCheck,
  Users,
  ClipboardCheck,
  Clock,
  Hourglass,
  CalendarDays,
  ListOrdered,
  Search,
  Stethoscope,
} from 'lucide-react'
import { useDoctorData } from '@/hooks/use-mock-data'
import { StatCard } from '@/components/stat-card'
import { QuickActions } from '@/components/quick-actions'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusBadge = (status: string) => {
  const map: Record<string, { variant: 'warning' | 'secondary' | 'default' | 'success'; label: string }> = {
    waiting: { variant: 'warning', label: 'Waiting' },
    checked_in: { variant: 'secondary', label: 'Checked In' },
    confirmed: { variant: 'default', label: 'Confirmed' },
    in_progress: { variant: 'default', label: 'In Progress' },
    completed: { variant: 'success', label: 'Completed' },
  }
  const s = map[status] ?? { variant: 'default' as const, label: status }
  return <Badge variant={s.variant}>{s.label}</Badge>
}

const typeColors: Record<string, string> = {
  consultation: 'text-secondary',
  'follow-up': 'text-success',
  checkup: 'text-primary',
  procedure: 'text-warning',
}

const typeLabels: Record<string, string> = {
  consultation: 'General Consultation',
  'follow-up': 'Follow-up',
  checkup: 'Checkup',
  procedure: 'Procedure',
}

export default function DoctorHome() {
  const { appointments } = useDoctorData()

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const todayApps = appointments.filter((a) => a.date === today)
    const waiting = todayApps.filter((a) => a.status === 'waiting' || a.status === 'checked_in')
    const completed = todayApps.filter((a) => a.status === 'completed')
    const remaining = todayApps.filter((a) => a.status === 'confirmed' || a.status === 'waiting' || a.status === 'checked_in')
    const avgTime = completed.length > 0 ? '18 min' : '--'
    return {
      total: todayApps.length,
      waiting: waiting.length,
      completed: completed.length,
      remaining: remaining.length,
      avgTime,
    }
  }, [appointments])

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => a.time.localeCompare(b.time)),
    [appointments],
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <div className="mb-1 text-sm font-medium text-secondary">Welcome back, Doctor</div>
        <h1 className="text-2xl font-bold text-primary">Doctor Dashboard</h1>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <StatCard
          title="Today's Appointments"
          value={stats.total}
          icon={CalendarCheck}
          variant="default"
        />
        <StatCard
          title="Patients Waiting"
          value={stats.waiting}
          icon={Users}
          variant="warning"
        />
        <StatCard
          title="Completed Consultations"
          value={stats.completed}
          icon={ClipboardCheck}
          variant="success"
        />
        <StatCard
          title="Remaining Patients"
          value={stats.remaining}
          icon={Hourglass}
          variant="default"
        />
        <StatCard
          title="Avg Consultation Time"
          value={stats.avgTime}
          icon={Clock}
          variant="default"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Link
                to="/doctor/appointments"
                className="text-sm font-medium text-secondary hover:underline"
              >
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {sortedAppointments.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <CalendarCheck className="mb-2 h-8 w-8" />
                  <p className="text-sm">No appointments scheduled today</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sortedAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-[4rem] text-center">
                        <div className="text-sm font-semibold text-foreground">
                          {apt.time}
                        </div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback name={apt.patientName} />
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/doctor/patient/${apt.patientId}`}
                          className="text-sm font-medium text-foreground hover:text-secondary"
                        >
                          {apt.patientName}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-xs font-medium', typeColors[apt.type] ?? 'text-muted')}>
                            {typeLabels[apt.type] ?? apt.type}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">{statusBadge(apt.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions
                role="doctor"
                actions={[
                  { label: 'View All Appointments', icon: CalendarDays, href: '/doctor/appointments' },
                  { label: 'Manage Queue', icon: ListOrdered, href: '/doctor/queue' },
                  { label: 'Open Calendar', icon: CalendarCheck, href: '/doctor/calendar' },
                  { label: 'Patient Search', icon: Search, href: '/doctor/appointments' },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-secondary/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Checked In</p>
                      <p className="text-xs text-muted-foreground">Ready for consultation</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-secondary">
                    {appointments.filter((a) => a.status === 'checked_in').length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-success/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">In Progress</p>
                      <p className="text-xs text-muted-foreground">Currently consulting</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-success">
                    {appointments.filter((a) => a.status === 'in_progress').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}


