import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Bell,
  Users,
  CreditCard,
  ClipboardList,
  User,
  ChevronRight,
  MapPin,
  Building2,
  Timer,
} from 'lucide-react'
import { usePatientData } from '@/hooks/use-mock-data'
import { useAuthStore } from '@/store/auth-store'
import { StatCard } from '@/components/stat-card'
import { QuickActions } from '@/components/quick-actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const statusColors: Record<string, 'warning' | 'success' | 'error'> = {
  open: 'success',
  busy: 'warning',
  closed: 'error',
}

const todayStatus: 'open' | 'busy' | 'closed' = 'busy'

const actions = [
  { label: 'Book Appointment', icon: Calendar, href: '/patient/appointments' },
  { label: 'Check Queue', icon: Users, href: '/patient/queue' },
  { label: 'Pay Bill', icon: CreditCard, href: '/patient/payments' },
  { label: 'Find Hospital', icon: MapPin, href: '/patient/hospitals' },
  { label: 'View History', icon: ClipboardList, href: '/patient/medical-history' },
]

export default function PatientHome() {
  const { user } = useAuthStore()
  const { appointments, queue } = usePatientData()

  const upcoming = appointments?.find((a) => a.status === 'confirmed' || a.status === 'pending')
  const currentQueue = queue?.[0]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Patient'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's your health overview for today
          </p>
        </div>
        <Badge
          variant={statusColors[todayStatus]}
          className="flex items-center gap-2 px-4 py-2 text-sm capitalize"
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          Hospital is {todayStatus}
        </Badge>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-l-4 border-l-secondary bg-gradient-to-br from-card to-secondary/5">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-foreground">Upcoming Appointment</span>
              </div>
              {upcoming ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {upcoming.hospitalName}
                      </p>
                      <p className="text-sm text-muted-foreground">{upcoming.department}</p>
                    </div>
                    <Badge
                      variant={
                        upcoming.status === 'confirmed'
                          ? 'success'
                          : upcoming.status === 'pending'
                            ? 'warning'
                            : 'default'
                      }
                      className="capitalize"
                    >
                      {upcoming.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-secondary" />
                      {upcoming.date} at {upcoming.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-secondary" />
                      {upcoming.doctorName}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              )}
              <button className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-secondary/80">
                View Details <ChevronRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-l-4 border-l-warning bg-gradient-to-br from-card to-warning/5">
            <CardContent className="p-6">
              {currentQueue ? (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-warning" />
                    <span className="font-semibold text-foreground">Queue Status</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-warning">
                      {currentQueue.queueNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      position #{currentQueue.position}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Timer className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-foreground">
                      Est. wait time: {currentQueue.estimatedWait} minutes
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {currentQueue.hospitalName} &middot; {currentQueue.department}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Users className="mb-2 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Not currently in any queue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Appointments Today"
          value={appointments?.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length ?? 0}
          icon={Calendar}
          variant="default"
          trend={12}
          description="vs yesterday"
        />
        <StatCard
          title="Queue Position"
          value={currentQueue?.queueNumber ?? 'N/A'}
          icon={Users}
          variant="warning"
          description={currentQueue ? `${currentQueue.estimatedWait} min wait` : 'No queue'}
        />
        <StatCard
          title="Pending Payments"
          value={0}
          icon={CreditCard}
          variant="error"
          description="No pending payments"
        />
        <StatCard
          title="Medical Records"
          value={0}
          icon={ClipboardList}
          variant="default"
          description="Total records"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        </div>
        <QuickActions role="patient" actions={actions} />
      </motion.div>
    </motion.div>
  )
}
