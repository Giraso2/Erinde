import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Calendar,
  Users,
  UserPlus,
  XCircle,
  Clock,
  Timer,
  Download,
  Stethoscope,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButton } from '@/components/export-button'
import { LoadingSkeleton } from '@/components/loading-skeleton'

const dailyStats = [
  { title: 'Total Checked In', value: '87', icon: Users, variant: 'default' as const, trend: 12 },
  { title: 'Walk-ins', value: '31', icon: UserPlus, variant: 'warning' as const, trend: -5 },
  { title: 'Missed Appointments', value: '4', icon: XCircle, variant: 'error' as const, trend: -2 },
  { title: 'Avg Check-in Time', value: '4.2 min', icon: Clock, variant: 'default' as const, trend: -8 },
  { title: 'Avg Waiting Time', value: '18 min', icon: Timer, variant: 'default' as const, trend: 5 },
]

const hourlyData = [
  { hour: '07:00', patients: 3 },
  { hour: '08:00', patients: 8 },
  { hour: '09:00', patients: 12 },
  { hour: '10:00', patients: 15 },
  { hour: '11:00', patients: 11 },
  { hour: '12:00', patients: 6 },
  { hour: '13:00', patients: 5 },
  { hour: '14:00', patients: 10 },
  { hour: '15:00', patients: 14 },
  { hour: '16:00', patients: 9 },
  { hour: '17:00', patients: 4 },
]

const departmentData = [
  { department: 'General Consultation', patients: 28, avgWait: 12, status: 'normal' as const },
  { department: 'Cardiology', patients: 15, avgWait: 22, status: 'busy' as const },
  { department: 'Pediatrics', patients: 12, avgWait: 15, status: 'normal' as const },
  { department: 'Emergency', patients: 18, avgWait: 8, status: 'overloaded' as const },
  { department: 'Maternity', patients: 8, avgWait: 20, status: 'normal' as const },
  { department: 'Laboratory', patients: 6, avgWait: 10, status: 'normal' as const },
]

const doctorAvailabilityLog = [
  { name: 'Dr. Jean Damascene', department: 'Cardiology', status: 'Available', hours: '08:00 - 17:00' },
  { name: 'Dr. Alice Benishyaka', department: 'Pediatrics', status: 'In Consultation', hours: '08:00 - 17:00' },
  { name: 'Dr. Eric Niyonzima', department: 'Emergency', status: 'Available', hours: '14:00 - 22:00' },
  { name: 'Dr. Marie Goretti', department: 'Maternity', status: 'On Break', hours: '08:00 - 17:00' },
  { name: 'Dr. John Mugabo', department: 'General Consultation', status: 'Available', hours: '08:00 - 17:00' },
  { name: 'Dr. Samuel Nkusi', department: 'General Consultation', status: 'In Consultation', hours: '08:00 - 17:00' },
]

const statusBadge: Record<string, 'success' | 'secondary' | 'warning' | 'error'> = {
  Available: 'success',
  'In Consultation': 'secondary',
  'On Break': 'warning',
  'Off Duty': 'error',
}

const departmentStatusColor: Record<string, string> = {
  normal: 'bg-success/10 text-success',
  busy: 'bg-warning/10 text-warning',
  overloaded: 'bg-error/10 text-error',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-soft">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground">{payload[0].value} patients</p>
      </div>
    )
  }
  return null
}

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Daily Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View daily statistics, charts, and department performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            leftIcon={<Calendar className="h-4 w-4" />}
            className="w-44"
          />
          <ExportButton
            onExportPDF={() => {}}
            onExportExcel={() => {}}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {dailyStats.map((stat) => (
              <Card key={stat.title} className="border-l-4 border-l-secondary">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      {stat.trend !== undefined && (
                        <span className={`text-xs font-medium ${stat.trend >= 0 ? 'text-success' : 'text-error'}`}>
                          {stat.trend >= 0 ? '+' : ''}{stat.trend}% vs yesterday
                        </span>
                      )}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Patients Per Hour</CardTitle>
                  <ExportButton
                    onExportPDF={() => {}}
                    onExportExcel={() => {}}
                  />
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                          dataKey="hour"
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="patients"
                          fill="#2563EB"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={48}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Doctor Availability</CardTitle>
                  <ExportButton
                    onExportPDF={() => {}}
                    onExportExcel={() => {}}
                  />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {doctorAvailabilityLog.map((doctor, index) => (
                      <div key={index} className="flex items-center justify-between px-5 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">{doctor.department}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusBadge[doctor.status] ?? 'default'} className="text-[10px]">
                            {doctor.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Department Breakdown</CardTitle>
                <ExportButton
                  onExportPDF={() => {}}
                  onExportExcel={() => {}}
                />
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Patients</th>
                        <th className="px-6 py-4">Avg Wait Time</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept, index) => (
                        <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/5">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-secondary" />
                              <span className="text-sm font-medium text-foreground">{dept.department}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{dept.patients}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{dept.avgWait} min</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${departmentStatusColor[dept.status]}`}>
                              {dept.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
