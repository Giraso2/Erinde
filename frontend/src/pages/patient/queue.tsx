import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Timer,
  Building2,
  Activity,
  RefreshCw,
  Clock,
  ChevronRight,
  CheckCircle2,
  Phone,
  ArrowRight,
} from 'lucide-react'
import { usePatientData } from '@/hooks/use-mock-data'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const statusVariant: Record<string, 'warning' | 'secondary' | 'success' | 'error'> = {
  waiting: 'warning',
  called: 'secondary',
  in_progress: 'secondary',
  completed: 'success',
  missed: 'error',
}

const queueHistory = [
  { id: 'qh-1', department: 'Cardiology', number: 'A042', status: 'completed', date: 'Today, 10:30 AM' },
  { id: 'qh-2', department: 'Laboratory', number: 'B018', status: 'completed', date: 'Yesterday, 2:15 PM' },
  { id: 'qh-3', department: 'Pharmacy', number: 'C034', status: 'completed', date: 'Jun 28, 11:00 AM' },
]

export default function PatientQueue() {
  const { queue } = usePatientData()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const currentQueue = queue?.[0]

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Queue Status</h1>
          <p className="mt-1 text-muted-foreground">Real-time queue information</p>
        </div>
        <LoadingSkeleton type="card" count={2} />
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
          <h1 className="text-2xl font-bold text-foreground">Queue Status</h1>
          <p className="mt-1 text-muted-foreground">Real-time queue information</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-soft transition-all hover:shadow-md"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {currentQueue ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-semibold text-foreground">{currentQueue.hospitalName}</p>
                    <p className="text-sm text-muted-foreground">{currentQueue.department}</p>
                  </div>
                </div>
                <Badge variant={statusVariant[currentQueue.status]} className="flex items-center gap-1.5 px-4 py-1.5 capitalize">
                  <span className={`h-2 w-2 rounded-full ${currentQueue.status === 'waiting' ? 'animate-pulse bg-current' : 'bg-current'}`} />
                  {currentQueue.status}
                </Badge>
              </div>

              <div className="mb-8 flex flex-col items-center">
                <p className="mb-1 text-sm font-medium text-muted-foreground">Your Queue Number</p>
                <p className="text-6xl font-bold text-secondary" style={{ fontSize: '60px', lineHeight: 1.1 }}>
                  {currentQueue.queueNumber}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Position #{currentQueue.position} in line
                </p>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Queue Progress</span>
                  <span className="font-medium text-foreground">
                    {currentQueue.position} of {10} ahead
                  </span>
                </div>
                <Progress
                  value={Math.max(0, 100 - (currentQueue.position / 10) * 100)}
                  variant="default"
                  className="h-3"
                />
              </div>

              <div className="flex items-center justify-center gap-4 rounded-2xl bg-secondary/5 p-4">
                <Timer className="h-6 w-6 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Wait Time</p>
                  <p className="text-xl font-bold text-foreground">
                    ~{currentQueue.estimatedWait} minutes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-secondary" />
                  Currently Serving
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">A042</p>
                <p className="mt-1 text-sm text-muted-foreground">Cardiology Department</p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-sm font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Called 2 min ago
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <RefreshCw className="h-4 w-4 text-secondary" />
                  Auto-Refresh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                  </span>
                  <span className="text-sm text-muted-foreground">Updates every 30s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-secondary" />
                  Queue Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ahead of you</span>
                  <span className="font-medium text-foreground">{currentQueue.position - 1} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Behind you</span>
                  <span className="font-medium text-foreground">7 people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total in queue</span>
                  <span className="font-medium text-foreground">{currentQueue.position + 7}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Users className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">Not in Queue</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              You are not currently registered in any queue.
            </p>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
              Join a Queue <ArrowRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-secondary" />
            Recent Queue History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {queueHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                    <Building2 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.department}</p>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">{entry.number}</span>
                  <Badge variant={statusVariant[entry.status]} className="capitalize">
                    {entry.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
