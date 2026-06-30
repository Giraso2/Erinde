import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Activity, Stethoscope, DollarSign, Building2, Clock,
  BedDouble, Ambulance, BarChart3, TrendingUp, PieChart,
  UserCheck, ListOrdered, FileText,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RePieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAdminData } from '@/hooks/use-mock-data'
import { StatCard } from '@/components/stat-card'
import { QuickActions } from '@/components/quick-actions'
import { ExportButton } from '@/components/export-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'

const chartColors = ['#2563EB', '#0B1F4D', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6', '#EC4899', '#06B6D4']

const patientsByDeptData = [
  { department: 'General', patients: 145 },
  { department: 'Pediatrics', patients: 98 },
  { department: 'Emergency', patients: 72 },
  { department: 'Maternity', patients: 88 },
  { department: 'Cardiology', patients: 54 },
  { department: 'Dermatology', patients: 41 },
  { department: 'Laboratory', patients: 120 },
  { department: 'Pharmacy', patients: 200 },
]

const revenueTrendData = [
  { day: 'Mon', revenue: 1240000 },
  { day: 'Tue', revenue: 1580000 },
  { day: 'Wed', revenue: 1420000 },
  { day: 'Thu', revenue: 1890000 },
  { day: 'Fri', revenue: 1650000 },
  { day: 'Sat', revenue: 1100000 },
  { day: 'Sun', revenue: 950000 },
]

const deptLoadData = [
  { name: 'General', value: 25 },
  { name: 'Pediatrics', value: 18 },
  { name: 'Emergency', value: 15 },
  { name: 'Maternity', value: 16 },
  { name: 'Cardiology', value: 10 },
  { name: 'Others', value: 16 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'normal': return 'success'
    case 'busy': return 'warning'
    case 'overloaded': return 'error'
    default: return 'default'
  }
}

export default function AdminDashboard() {
  const { stats, departments } = useAdminData()
  const [bedOccupancy] = useState(73)
  const [emergencyCases] = useState(12)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hospital Dashboard</h1>
          <p className="text-sm text-muted">Real-time overview of hospital operations</p>
        </div>
        <ExportButton
          onExportPDF={() => {}}
          onExportExcel={() => {}}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Patients Today"
          value={stats.patientsToday}
          icon={Users}
          trend={12}
          description="vs yesterday"
          variant="default"
        />
        <StatCard
          title="Active Queues"
          value={departments.reduce((a, d) => a + d.queueLength, 0)}
          icon={Activity}
          trend={-5}
          description="vs yesterday"
          variant="warning"
        />
        <StatCard
          title="Doctors On Duty"
          value={stats.activeStaff}
          icon={Stethoscope}
          trend={8}
          description="vs yesterday"
          variant="success"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Revenue Today"
          value={formatCurrency(stats.revenueToday)}
          icon={DollarSign}
          trend={15}
          description="vs yesterday"
          variant="default"
        />
        <StatCard
          title="Departments Open"
          value={departments.length}
          icon={Building2}
          description="All departments operational"
          variant="default"
        />
        <StatCard
          title="Avg Wait Time"
          value={`${stats.avgWaitTime} min`}
          icon={Clock}
          trend={-10}
          description="improvement"
          variant={stats.avgWaitTime > 20 ? 'error' : 'success'}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-muted">Bed Occupancy</h3>
              <p className="text-2xl font-bold text-foreground">{bedOccupancy}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
              <BedDouble className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <Progress
            value={bedOccupancy}
            variant={bedOccupancy > 85 ? 'error' : bedOccupancy > 70 ? 'warning' : 'success'}
            className="mb-2 h-3"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>245 / 335 beds filled</span>
            <span>{bedOccupancy >= 90 ? 'Critical' : bedOccupancy >= 75 ? 'High' : 'Normal'}</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-muted">Emergency Cases</h3>
              <p className="text-2xl font-bold text-foreground">{emergencyCases}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10">
              <Ambulance className="h-6 w-6 text-error" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Critical</span>
              <span className="font-medium text-error">{emergencyCases}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Available Ambulances</span>
              <span className="font-medium text-foreground">4</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Avg Response Time</span>
              <span className="font-medium text-foreground">12 min</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-secondary" />
              Patients by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientsByDeptData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar dataKey="patients" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-secondary" />
              Revenue Trend (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
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

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-4 w-4 text-secondary" />
              Department Load Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={deptLoadData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deptLoadData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted">{value}</span>
                    )}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListOrdered className="h-4 w-4 text-secondary" />
              Department Queue Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Queue Length</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Avg Wait</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Doctors on Duty</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b border-border transition-colors hover:bg-secondary/5">
                      <td className="px-4 py-3 font-medium text-foreground">{dept.name}</td>
                      <td className="px-4 py-3 text-foreground">{dept.queueLength}</td>
                      <td className="px-4 py-3 text-foreground">{dept.avgWaitTime} min</td>
                      <td className="px-4 py-3 text-foreground">{dept.doctorsOnDuty}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(dept.status)}>
                          {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <QuickActions
          role="admin"
          actions={[
            { label: 'Manage Queue', icon: ListOrdered, href: '/admin/queue' },
            { label: 'Staff Schedule', icon: UserCheck, href: '/admin/staff' },
            { label: 'View Reports', icon: FileText, href: '/admin/reports' },
          ]}
        />
      </motion.div>
    </motion.div>
  )
}
