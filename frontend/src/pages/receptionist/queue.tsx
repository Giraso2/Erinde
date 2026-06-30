import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ListOrdered,
  SkipForward,
  RotateCcw,
  UserCheck,
  ArrowRight,
  AlertTriangle,
  Clock,
  Users,
  Timer,
  Gauge,
  PhoneCall,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingSkeleton } from '@/components/loading-skeleton'

interface QueueItem {
  id: string
  queueNumber: string
  patientName: string
  department: string
  doctor: string
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'missed'
  waitingTime: number
}

const departments = ['All', 'General Consultation', 'Pediatrics', 'Emergency', 'Maternity', 'Cardiology', 'Laboratory']

const mockQueue: QueueItem[] = [
  { id: '1', queueNumber: 'A001', patientName: 'Alice Uwimana', department: 'Cardiology', doctor: 'Dr. Jean Damascene', status: 'waiting', waitingTime: 25 },
  { id: '2', queueNumber: 'A002', patientName: 'Jean Marie Vianney', department: 'General Consultation', doctor: 'Dr. Emmanuel Ndayisaba', status: 'called', waitingTime: 10 },
  { id: '3', queueNumber: 'A003', patientName: 'Frida Mukamana', department: 'Pediatrics', doctor: 'Dr. Alice Benishyaka', status: 'in_progress', waitingTime: 8 },
  { id: '4', queueNumber: 'A004', patientName: 'Eric Mugisha', department: 'Emergency', doctor: 'Dr. Eric Niyonzima', status: 'waiting', waitingTime: 35 },
  { id: '5', queueNumber: 'A005', patientName: 'Marie Claire Uwase', department: 'Cardiology', doctor: 'Dr. Jean Damascene', status: 'completed', waitingTime: 0 },
  { id: '6', queueNumber: 'A006', patientName: 'Patrick Habimana', department: 'Maternity', doctor: 'Dr. Marie Goretti', status: 'missed', waitingTime: 45 },
  { id: '7', queueNumber: 'A007', patientName: 'Diane Umubyeyi', department: 'General Consultation', doctor: 'Dr. Emmanuel Ndayisaba', status: 'waiting', waitingTime: 18 },
  { id: '8', queueNumber: 'A008', patientName: 'Jean Pierre Niyonzima', department: 'Pediatrics', doctor: 'Dr. Alice Benishyaka', status: 'waiting', waitingTime: 22 },
  { id: '9', queueNumber: 'A009', patientName: 'Grace Uwimana', department: 'Laboratory', doctor: 'Dr. Beatrice Mukantabana', status: 'called', waitingTime: 5 },
  { id: '10', queueNumber: 'A010', patientName: 'Olivier Niyomugabo', department: 'Emergency', doctor: 'Dr. Eric Niyonzima', status: 'waiting', waitingTime: 15 },
  { id: '11', queueNumber: 'A011', patientName: 'Chantal Nyiraneza', department: 'Maternity', doctor: 'Dr. Marie Goretti', status: 'waiting', waitingTime: 30 },
  { id: '12', queueNumber: 'A012', patientName: 'David Hakizimana', department: 'Cardiology', doctor: 'Dr. Jean Damascene', status: 'in_progress', waitingTime: 3 },
]

const statusStyles: Record<string, 'warning' | 'secondary' | 'default' | 'success' | 'error'> = {
  waiting: 'warning',
  called: 'secondary',
  in_progress: 'default',
  completed: 'success',
  missed: 'error',
}

const statusLabels: Record<string, string> = {
  waiting: 'Waiting',
  called: 'Called',
  in_progress: 'In Progress',
  completed: 'Completed',
  missed: 'Missed',
}

export default function QueueManagement() {
  const [department, setDepartment] = useState('All')
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {}, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredQueue = department === 'All'
    ? mockQueue
    : mockQueue.filter((item) => item.department === department)

  const totalWaiting = filteredQueue.filter((q) => q.status === 'waiting' || q.status === 'called').length
  const avgWait = filteredQueue.length > 0
    ? Math.round(filteredQueue.reduce((sum, q) => sum + q.waitingTime, 0) / filteredQueue.length)
    : 0
  const longestWait = filteredQueue.length > 0
    ? Math.max(...filteredQueue.map((q) => q.waitingTime))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Queue Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage the patient queue in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
              autoRefresh ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${autoRefresh ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <Button variant="secondary" size="lg" className="gap-2">
            <PhoneCall className="h-5 w-5" />
            Call Next Patient
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <Card className="border-l-4 border-l-secondary">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total in Queue</p>
              <p className="text-2xl font-bold text-foreground">{totalWaiting}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10">
              <Timer className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Wait Time</p>
              <p className="text-2xl font-bold text-foreground">{avgWait} min</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-error">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10">
              <Gauge className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Wait</p>
              <p className="text-2xl font-bold text-foreground">{longestWait} min</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Patient Queue</CardTitle>
              <Tabs value={department} onValueChange={setDepartment}>
                <TabsList className="w-full overflow-x-auto sm:w-auto">
                  {departments.map((dept) => (
                    <TabsTrigger key={dept} value={dept} className="whitespace-nowrap text-xs">
                      {dept}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <LoadingSkeleton type="table" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                      <th className="px-6 py-4">Queue #</th>
                      <th className="px-6 py-4">Patient Name</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Doctor</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Waiting Time</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueue.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border last:border-0 hover:bg-secondary/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-bold text-foreground">
                            {item.queueNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-foreground">
                            {item.patientName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {item.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {item.doctor}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusStyles[item.status]}>
                            {statusLabels[item.status]}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {item.status === 'completed' ? '--' : `${item.waitingTime} min`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" title="Call Next">
                              <PhoneCall className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Skip">
                              <SkipForward className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Recall">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Mark Arrived">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Redirect">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Emergency Priority">
                              <AlertTriangle className="h-4 w-4 text-error" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredQueue.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                          No patients in this department queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
