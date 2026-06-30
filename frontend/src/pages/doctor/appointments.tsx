import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, CalendarCheck, Users, Stethoscope, ArrowRight } from 'lucide-react'
import { useDoctorData } from '@/hooks/use-mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'

type FilterType = 'all' | 'waiting' | 'checked_in' | 'completed'

const statusConfig: Record<string, { variant: 'warning' | 'secondary' | 'default' | 'success' | 'error'; label: string }> = {
  waiting: { variant: 'warning', label: 'Waiting' },
  checked_in: { variant: 'secondary', label: 'Checked In' },
  in_progress: { variant: 'default', label: 'In Progress' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
}

const typeLabels: Record<string, string> = {
  consultation: 'General Consultation',
  'follow-up': 'Follow-up',
  checkup: 'Checkup',
  procedure: 'Procedure',
}

export default function Appointments() {
  const { appointments } = useDoctorData()
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => a.time.localeCompare(b.time)),
    [appointments],
  )

  const filteredAppointments = useMemo(() => {
    return sortedAppointments.filter((apt) => {
      if (filter !== 'all' && apt.status !== filter) return false
      if (search && !apt.patientName.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [sortedAppointments, filter, search])

  const nextPatient = useMemo(
    () => sortedAppointments.find((a) => a.status === 'waiting' || a.status === 'checked_in'),
    [sortedAppointments],
  )

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'checked_in', label: 'Checked In' },
    { key: 'completed', label: 'Completed' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-1 text-sm font-medium text-secondary">Doctor Panel</div>
        <h1 className="text-2xl font-bold text-primary">Appointments</h1>
        <LoadingSkeleton type="table" count={1} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <div className="mb-1 text-sm font-medium text-secondary">Doctor Panel</div>
        <h1 className="text-2xl font-bold text-primary">Appointments</h1>
      </div>

      {nextPatient && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-secondary/30 bg-gradient-to-r from-secondary/5 to-secondary/10">
            <CardContent className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <Stethoscope className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-secondary">Next Patient</p>
                  <p className="text-lg font-semibold text-foreground">
                    {nextPatient.patientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nextPatient.time} &middot; {typeLabels[nextPatient.type] ?? nextPatient.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={nextPatient.status === 'checked_in' ? 'secondary' : 'warning'}>
                  {nextPatient.status === 'checked_in' ? 'Checked In' : 'Waiting'}
                </Badge>
                <Link to={`/doctor/consultation/${nextPatient.patientId}`}>
                  <Button variant="primary" size="sm" className="gap-1">
                    Start <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-secondary/10 hover:text-secondary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search patients..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No appointments found"
              description={
                search
                  ? 'No patients match your search criteria.'
                  : 'There are no appointments with the selected status.'
              }
              action={
                search || filter !== 'all'
                  ? {
                      label: 'Clear Filters',
                      onClick: () => {
                        setSearch('')
                        setFilter('all')
                      },
                    }
                  : undefined
              }
            />
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted md:grid md:grid-cols-[80px_1fr_1fr_1fr_120px]">
                <span>Time</span>
                <span>Patient Name</span>
                <span>Type</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="grid gap-3 px-6 py-4 transition-colors hover:bg-accent/50 md:grid-cols-[80px_1fr_1fr_1fr_120px] md:items-center"
                >
                  <div className="text-sm font-semibold text-foreground">{apt.time}</div>
                  <Link
                    to={`/doctor/patient/${apt.patientId}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback name={apt.patientName} />
                    </Avatar>
                    <span className="text-sm font-medium text-foreground hover:text-secondary">
                      {apt.patientName}
                    </span>
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {typeLabels[apt.type] ?? apt.type}
                  </div>
                  <div>
                    <Badge variant={statusConfig[apt.status]?.variant ?? 'default'}>
                      {statusConfig[apt.status]?.label ?? apt.status}
                    </Badge>
                  </div>
                  <div className="flex justify-end gap-2">
                    {apt.status === 'waiting' || apt.status === 'checked_in' ? (
                      <Link to={`/doctor/consultation/${apt.patientId}`}>
                        <Button variant="primary" size="sm">
                          Consult
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/doctor/patient/${apt.patientId}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
