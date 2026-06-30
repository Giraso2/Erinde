import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays, BarChart3, TrendingUp, Download,
  Star, Clock, Users, Stethoscope, FileText, CalendarRange,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import { useAdminData } from '@/hooks/use-mock-data'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ExportButton } from '@/components/export-button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const reportTypes = [
  {
    key: 'daily',
    title: 'Daily Report',
    description: 'Summary of today\'s operations, revenue, and patient flow',
    icon: CalendarDays,
    color: '#2563EB',
  },
  {
    key: 'weekly',
    title: 'Weekly Report',
    description: 'Weekly trends in patient visits, revenue, and department performance',
    icon: BarChart3,
    color: '#16A34A',
  },
  {
    key: 'monthly',
    title: 'Monthly Report',
    description: 'Comprehensive monthly analysis with financial summaries',
    icon: TrendingUp,
    color: '#F59E0B',
  },
  {
    key: 'yearly',
    title: 'Yearly Report',
    description: 'Annual performance review with year-over-year comparisons',
    icon: CalendarRange,
    color: '#8B5CF6',
  },
]

const departmentPerformanceData = [
  { department: 'Cardiology', patients: 320, satisfaction: 94, avgTime: 22 },
  { department: 'Pediatrics', patients: 445, satisfaction: 91, avgTime: 18 },
  { department: 'Emergency', patients: 510, satisfaction: 87, avgTime: 14 },
  { department: 'Maternity', patients: 280, satisfaction: 96, avgTime: 25 },
  { department: 'General', patients: 680, satisfaction: 89, avgTime: 16 },
  { department: 'Dermatology', patients: 195, satisfaction: 93, avgTime: 20 },
  { department: 'Laboratory', patients: 720, satisfaction: 90, avgTime: 10 },
  { department: 'Pharmacy', patients: 890, satisfaction: 88, avgTime: 8 },
]

const waitTimeTrendData = [
  { day: 'Mon', avgWait: 16 },
  { day: 'Tue', avgWait: 19 },
  { day: 'Wed', avgWait: 15 },
  { day: 'Thu', avgWait: 22 },
  { day: 'Fri', avgWait: 20 },
  { day: 'Sat', avgWait: 12 },
  { day: 'Sun', avgWait: 10 },
]

const doctorPerformanceData = [
  { name: 'Dr. Jean Damascene', rating: 4.8, consultations: 28, avgTimePerPatient: 18, department: 'Cardiology' },
  { name: 'Dr. Alice Benishyaka', rating: 4.9, consultations: 32, avgTimePerPatient: 15, department: 'Pediatrics' },
  { name: 'Dr. Eric Niyonzima', rating: 4.6, consultations: 24, avgTimePerPatient: 12, department: 'Emergency' },
  { name: 'Dr. Marie Goretti', rating: 4.7, consultations: 20, avgTimePerPatient: 22, department: 'Maternity' },
  { name: 'Dr. John Mugabo', rating: 4.5, consultations: 18, avgTimePerPatient: 20, department: 'General' },
  { name: 'Dr. Olive Uwamahoro', rating: 4.8, consultations: 22, avgTimePerPatient: 17, department: 'Dermatology' },
  { name: 'Dr. Samuel Nkusi', rating: 4.4, consultations: 15, avgTimePerPatient: 14, department: 'Laboratory' },
  { name: 'Dr. Beatrice Mukantabana', rating: 4.7, consultations: 30, avgTimePerPatient: 10, department: 'Pharmacy' },
]

const overallSatisfaction = 91

export default function Reports() {
  const { departments } = useAdminData()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('2026-06-01')
  const [endDate, setEndDate] = useState('2026-06-30')

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="chart" count={2} />
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted">Generate and analyze hospital performance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5">
            <CalendarDays className="h-4 w-4 text-muted" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-36 border-0 p-0 text-sm"
            />
            <span className="text-muted">—</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-36 border-0 p-0 text-sm"
            />
          </div>
          <Button variant="primary" size="sm">
            <FileText className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <Card key={report.key} className="p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${report.color}15`, color: report.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{report.title}</p>
                    <p className="text-xs text-muted">{report.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3.5 w-3.5" />
                  Excel
                </Button>
              </div>
            </Card>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-secondary" />
              Department Performance
            </CardTitle>
            <CardDescription>Patient volume by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerformanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="patients" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-secondary" />
              Patient Satisfaction
            </CardTitle>
            <CardDescription>Overall hospital rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-6">
              <div className="relative mb-4 flex h-32 w-32 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="64" cy="64" r="56"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallSatisfaction / 100) * 352} 352`}
                  />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-bold text-foreground">{overallSatisfaction}%</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(overallSatisfaction / 20) ? 'fill-warning text-warning' : 'text-border'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">Based on 1,247 patient reviews</p>
            </div>
            <div className="space-y-3 border-t border-border pt-4">
              {departmentPerformanceData.slice(0, 4).map((dept) => (
                <div key={dept.department} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary/10">
                      <div
                        className="h-full rounded-full bg-secondary transition-all"
                        style={{ width: `${dept.satisfaction}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{dept.satisfaction}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-4 w-4 text-secondary" />
              Doctor Performance
            </CardTitle>
            <CardDescription>Consultation metrics and patient ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted">Doctor</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Patient Rating</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Consultations</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Avg Time / Patient</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorPerformanceData.map((doc) => (
                    <tr key={doc.name} className="border-b border-border transition-colors hover:bg-secondary/5">
                      <td className="px-4 py-3 font-medium text-foreground">{doc.name}</td>
                      <td className="px-4 py-3 text-muted">{doc.department}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          <span className="text-foreground">{doc.rating}</span>
                          <span className="text-xs text-muted">/ 5.0</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{doc.consultations}</td>
                      <td className="px-4 py-3 text-foreground">{doc.avgTimePerPatient} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-secondary" />
                Average Waiting Time Trend
              </CardTitle>
              <CardDescription>Daily average wait times across all departments</CardDescription>
            </div>
            <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waitTimeTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" domain={[0, 30]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value: number) => [`${value} min`, 'Avg Wait']}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgWait"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ fill: '#2563EB', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
