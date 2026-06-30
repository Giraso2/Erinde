import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw, Users, Clock, User, SkipForward, Star,
  CalendarClock, XCircle, AlertTriangle, ArrowRight,
} from 'lucide-react'
import { useAdminData } from '@/hooks/use-mock-data'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface QueuePatient {
  id: string
  position: number
  name: string
  timeJoined: string
  estimatedWait: number
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'missed'
}

const departments = [
  'General Consultation',
  'Pediatrics',
  'Emergency',
  'Maternity',
  'Cardiology',
  'Dermatology',
  'Laboratory',
  'Pharmacy',
]

const patientNames = [
  'Alice Uwimana', 'Jean Marie Vianney', 'Frida Mukamana', 'Eric Mugisha',
  'Marie Claire Uwase', 'Patrick Habimana', 'Diane Umubyeyi', 'Jean Pierre Niyonzima',
  'Grace Uwimana', 'Olivier Niyomugabo', 'Chantal Nyiraneza', 'David Hakizimana',
  'Esther Mukeshimana', 'Emmanuel Ndayisaba', 'Joseph Mugabo',
]

function generateQueuePatients(count: number): QueuePatient[] {
  const statuses: QueuePatient['status'][] = ['waiting', 'called', 'in_progress', 'completed', 'missed']
  return Array.from({ length: count }, (_, i) => ({
    id: `q-${i}`,
    position: i + 1,
    name: patientNames[i % patientNames.length],
    timeJoined: `${String(8 + Math.floor(i / 3)).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
    estimatedWait: Math.max(5, 25 - i * 2),
    status: i === 0 ? 'in_progress' : i < 3 ? 'waiting' : 'waiting',
  }))
}

const statusBadge = (status: QueuePatient['status']) => {
  const map: Record<QueuePatient['status'], { variant: 'success' | 'warning' | 'secondary' | 'error' | 'default'; label: string }> = {
    waiting: { variant: 'warning', label: 'Waiting' },
    called: { variant: 'secondary', label: 'Called' },
    in_progress: { variant: 'success', label: 'In Progress' },
    completed: { variant: 'default', label: 'Completed' },
    missed: { variant: 'error', label: 'Missed' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function formatTimeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m ago`
}

export default function QueueManagement() {
  const { departments: deptStats } = useAdminData()
  const [activeDept, setActiveDept] = useState(departments[0])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadQueue = useCallback(() => {
    const dept = deptStats.find((d) => d.name === activeDept)
    const count = dept?.queueLength ?? 8
    setQueuePatients(generateQueuePatients(count))
    setLastRefresh(new Date())
    setRefreshing(false)
  }, [activeDept, deptStats])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      loadQueue()
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [activeDept, loadQueue])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setRefreshing(true)
      loadQueue()
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadQueue])

  const deptInfo = deptStats.find((d) => d.name === activeDept)
  const currentQueueLength = deptInfo?.queueLength ?? queuePatients.length
  const avgWait = deptInfo?.avgWaitTime ?? 12
  const longestWaitPatient = queuePatients.length > 0
    ? queuePatients.reduce((max, p) => (p.estimatedWait > max.estimatedWait ? p : max))
    : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Queue Management</h1>
          <p className="text-sm text-muted">Monitor and manage patient queues across departments</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
              autoRefresh
                ? 'bg-success/10 text-success'
                : 'bg-secondary/10 text-secondary'
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setRefreshing(true); loadQueue() }}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeDept} onValueChange={setActiveDept}>
          <TabsList className="mb-4 flex-wrap h-auto">
            {departments.map((dept) => (
              <TabsTrigger key={dept} value={dept} className="text-xs">
                {dept}
              </TabsTrigger>
            ))}
          </TabsList>

          {departments.map((dept) => (
            <TabsContent key={dept} value={dept}>
              {loading ? (
                <LoadingSkeleton type="card" count={1} />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted">Current Queue Length</p>
                          <p className="text-3xl font-bold text-foreground">{currentQueueLength}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
                          <Users className="h-6 w-6 text-secondary" />
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted">Longest Waiting Patient</p>
                          <p className="text-lg font-bold text-foreground">
                            {longestWaitPatient?.name ?? 'N/A'}
                          </p>
                          <p className="text-xs text-muted">
                            {longestWaitPatient ? `Wait time: ${longestWaitPatient.estimatedWait} min` : ''}
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10">
                          <Clock className="h-6 w-6 text-warning" />
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted">Average Waiting Time</p>
                          <p className="text-3xl font-bold text-foreground">{avgWait} min</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                          <Clock className="h-6 w-6 text-success" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Queue List</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">
                            <SkipForward className="h-4 w-4" />
                            Call Next
                          </Button>
                          <Button size="sm" variant="default">
                            <Star className="h-4 w-4" />
                            Priority
                          </Button>
                          <Button size="sm" variant="outline">
                            <CalendarClock className="h-4 w-4" />
                            Reschedule
                          </Button>
                          <Button size="sm" variant="danger">
                            <XCircle className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="px-4 py-3 text-left font-medium text-muted">#</th>
                              <th className="px-4 py-3 text-left font-medium text-muted">Patient Name</th>
                              <th className="px-4 py-3 text-left font-medium text-muted">Time Joined</th>
                              <th className="px-4 py-3 text-left font-medium text-muted">Est. Wait</th>
                              <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                              <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {queuePatients.map((patient) => (
                              <tr
                                key={patient.id}
                                className="border-b border-border transition-colors hover:bg-secondary/5"
                              >
                                <td className="px-4 py-3">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-xs font-bold text-secondary">
                                    {patient.position}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted" />
                                    <span className="font-medium text-foreground">{patient.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-muted">{patient.timeJoined}</td>
                                <td className="px-4 py-3 text-foreground">{patient.estimatedWait} min</td>
                                <td className="px-4 py-3">{statusBadge(patient.status)}</td>
                                <td className="px-4 py-3">
                                  <Button variant="ghost" size="sm">
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted">
                        <span>
                          Showing {queuePatients.length} patients | Last refreshed: {lastRefresh.toLocaleTimeString()}
                        </span>
                        {queuePatients.length > 0 && (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-warning" />
                            {queuePatients.filter((p) => p.estimatedWait > 20).length} patients waiting &gt;20 min
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
