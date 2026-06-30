import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  PhoneCall,
  CheckCircle2,
  XCircle,
  SkipForward,
  Clock,
  ArrowUpCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { useDoctorData } from '@/hooks/use-mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'

interface QueuePatient {
  id: string
  position: number
  name: string
  waitTime: number
  status: 'waiting' | 'called' | 'completed' | 'missed'
  priority: boolean
  department: string
}

const departments = [
  'All Departments',
  'Cardiology',
  'Pediatrics',
  'General Consultation',
  'Emergency',
  'Maternity',
]

const initialQueue: QueuePatient[] = [
  { id: 'q1', position: 1, name: 'Alice Uwimana', waitTime: 12, status: 'waiting', priority: false, department: 'Cardiology' },
  { id: 'q2', position: 2, name: 'Jean Marie Vianney', waitTime: 18, status: 'waiting', priority: true, department: 'Cardiology' },
  { id: 'q3', position: 3, name: 'Frida Mukamana', waitTime: 25, status: 'waiting', priority: false, department: 'Cardiology' },
  { id: 'q4', position: 4, name: 'Eric Mugisha', waitTime: 30, status: 'called', priority: false, department: 'Pediatrics' },
  { id: 'q5', position: 5, name: 'Patrick Habimana', waitTime: 35, status: 'waiting', priority: false, department: 'Cardiology' },
  { id: 'q6', position: 6, name: 'Diane Umubyeyi', waitTime: 42, status: 'completed', priority: false, department: 'Cardiology' },
]

export default function QueueManagement() {
  const [queue, setQueue] = useState<QueuePatient[]>(initialQueue)
  const [activeDepartment, setActiveDepartment] = useState('All Departments')
  const [loading, setLoading] = useState(false)

  const filteredQueue = useMemo(
    () =>
      activeDepartment === 'All Departments'
        ? queue
        : queue.filter((p) => p.department === activeDepartment),
    [queue, activeDepartment],
  )

  const stats = useMemo(() => {
    return {
      waiting: queue.filter((p) => p.status === 'waiting').length,
      called: queue.filter((p) => p.status === 'called').length,
      completed: queue.filter((p) => p.status === 'completed').length,
      missed: queue.filter((p) => p.status === 'missed').length,
    }
  }, [queue])

  const handleCallNext = () => {
    const next = queue.find((p) => p.status === 'waiting')
    if (next) {
      setQueue((prev) =>
        prev.map((p) =>
          p.id === next.id ? { ...p, status: 'called' as const } : p,
        ),
      )
    }
  }

  const handleReschedule = (id: string) => {
    setQueue((prev) => prev.filter((p) => p.id !== id))
  }

  const handleEmergencyPriority = (id: string) => {
    setQueue((prev) => {
      const target = prev.find((p) => p.id === id)
      if (!target) return prev
      const updated = prev.map((p) =>
        p.id === id ? { ...p, priority: true } : p,
      )
      return updated
    })
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: 'warning' | 'secondary' | 'success' | 'error'; label: string }> = {
      waiting: { variant: 'warning', label: 'Waiting' },
      called: { variant: 'secondary', label: 'Called' },
      completed: { variant: 'success', label: 'Completed' },
      missed: { variant: 'error', label: 'Missed' },
    }
    const s = map[status]
    return <Badge variant={s?.variant ?? 'default'}>{s?.label ?? status}</Badge>
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-1 text-sm font-medium text-secondary">Queue Management</div>
        <h1 className="text-2xl font-bold text-primary">Patient Queue</h1>
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="list" count={1} />
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <div className="mb-1 text-sm font-medium text-secondary">Queue Management</div>
          <h1 className="text-2xl font-bold text-primary">Patient Queue</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live
          </span>
          <Button variant="primary" size="lg" onClick={handleCallNext} className="gap-2">
            <SkipForward className="h-5 w-5" />
            Call Next Patient
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Waiting</p>
              <p className="text-xl font-bold text-foreground">{stats.waiting}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Called</p>
              <p className="text-xl font-bold text-foreground">{stats.called}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-bold text-foreground">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error/10 text-error">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Missed</p>
              <p className="text-xl font-bold text-foreground">{stats.missed}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeDepartment === dept
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-secondary/10 hover:text-secondary'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-0">
            {filteredQueue.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Queue is empty"
                description="No patients currently in the queue for this department."
                action={{
                  label: 'Refresh Queue',
                  onClick: () => setActiveDepartment('All Departments'),
                }}
              />
            ) : (
              <div className="divide-y divide-border">
                {filteredQueue.map((patient) => (
                  <div
                    key={patient.id}
                    className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                      patient.priority ? 'bg-warning/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm ${
                          patient.priority
                            ? 'bg-warning/20 text-warning'
                            : 'bg-secondary/10 text-secondary'
                        }`}
                      >
                        {patient.position}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback name={patient.name} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/doctor/patient/${patient.id}`}
                            className="text-sm font-medium text-foreground hover:text-secondary"
                          >
                            {patient.name}
                          </Link>
                          {patient.priority && (
                            <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                              Priority
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{patient.department}</span>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {patient.waitTime} min wait
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {statusBadge(patient.status)}
                      {patient.status === 'waiting' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              setQueue((prev) =>
                                prev.map((p) =>
                                  p.id === patient.id
                                    ? { ...p, status: 'called' as const }
                                    : p,
                                ),
                              )
                            }
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(patient.id)}
                          >
                            <Clock className="h-3.5 w-3.5" />
                          </Button>
                          {!patient.priority && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEmergencyPriority(patient.id)}
                              className="text-warning"
                            >
                              <ArrowUpCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
