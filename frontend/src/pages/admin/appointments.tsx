import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, Filter, ArrowRight, RotateCcw, XCircle,
  CheckCircle2, AlertTriangle, Download, CalendarClock, User,
  Building2, Stethoscope,
} from 'lucide-react'
import type { Appointment } from '@/types'
import { useAdminData } from '@/hooks/use-mock-data'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ExportButton } from '@/components/export-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency } from '@/lib/utils'

const appointmentsData: Appointment[] = [
  { id: 'apt-1', patientId: 'p1', patientName: 'Alice Uwimana', doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Cardiology', date: '2026-06-30', time: '09:00', status: 'confirmed', type: 'checkup' },
  { id: 'apt-2', patientId: 'p2', patientName: 'Jean Marie Vianney', doctorId: 'd2', doctorName: 'Dr. Alice Benishyaka', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Pediatrics', date: '2026-06-30', time: '10:00', status: 'checked_in', type: 'consultation' },
  { id: 'apt-3', patientId: 'p3', patientName: 'Frida Mukamana', doctorId: 'd3', doctorName: 'Dr. Eric Niyonzima', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Emergency', date: '2026-06-30', time: '11:30', status: 'waiting', type: 'follow-up' },
  { id: 'apt-4', patientId: 'p4', patientName: 'Eric Mugisha', doctorId: 'd4', doctorName: 'Dr. Marie Goretti', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Maternity', date: '2026-06-30', time: '08:00', status: 'completed', type: 'procedure' },
  { id: 'apt-5', patientId: 'p5', patientName: 'Marie Claire Uwase', doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Cardiology', date: '2026-06-30', time: '14:00', status: 'confirmed', type: 'checkup' },
  { id: 'apt-6', patientId: 'p6', patientName: 'Patrick Habimana', doctorId: 'd5', doctorName: 'Dr. John Mugabo', hospitalId: 'h1', hospitalName: 'CHUK', department: 'General Consultation', date: '2026-06-30', time: '15:00', status: 'cancelled', type: 'consultation' },
  { id: 'apt-7', patientId: 'p7', patientName: 'Diane Umubyeyi', doctorId: 'd6', doctorName: 'Dr. Olive Uwamahoro', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Dermatology', date: '2026-06-30', time: '16:00', status: 'completed', type: 'follow-up' },
  { id: 'apt-8', patientId: 'p8', patientName: 'Jean Pierre Niyonzima', doctorId: 'd7', doctorName: 'Dr. Samuel Nkusi', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Laboratory', date: '2026-06-30', time: '07:30', status: 'completed', type: 'lab_result' },
  { id: 'apt-9', patientId: 'p9', patientName: 'Grace Uwimana', doctorId: 'd8', doctorName: 'Dr. Beatrice Mukantabana', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Pharmacy', date: '2026-06-30', time: '09:30', status: 'confirmed', type: 'prescription' },
  { id: 'apt-10', patientId: 'p10', patientName: 'Olivier Niyomugabo', doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Cardiology', date: '2026-06-30', time: '11:00', status: 'missed', type: 'checkup' },
  { id: 'apt-11', patientId: 'p11', patientName: 'Chantal Nyiraneza', doctorId: 'd2', doctorName: 'Dr. Alice Benishyaka', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Pediatrics', date: '2026-07-01', time: '09:00', status: 'confirmed', type: 'consultation' },
  { id: 'apt-12', patientId: 'p12', patientName: 'David Hakizimana', doctorId: 'd3', doctorName: 'Dr. Eric Niyonzima', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Emergency', date: '2026-07-01', time: '10:00', status: 'confirmed', type: 'follow-up' },
  { id: 'apt-13', patientId: 'p13', patientName: 'Esther Mukeshimana', doctorId: 'd4', doctorName: 'Dr. Marie Goretti', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Maternity', date: '2026-06-28', time: '14:00', status: 'completed', type: 'procedure' },
  { id: 'apt-14', patientId: 'p14', patientName: 'Emmanuel Ndayisaba', doctorId: 'd5', doctorName: 'Dr. John Mugabo', hospitalId: 'h1', hospitalName: 'CHUK', department: 'General Consultation', date: '2026-06-27', time: '11:00', status: 'cancelled', type: 'consultation' },
  { id: 'apt-15', patientId: 'p15', patientName: 'Joseph Mugabo', doctorId: 'd6', doctorName: 'Dr. Olive Uwamahoro', hospitalId: 'h1', hospitalName: 'CHUK', department: 'Dermatology', date: '2026-06-29', time: '08:00', status: 'completed', type: 'follow-up' },
]

const statusBadge = (status: Appointment['status']) => {
  const map: Record<Appointment['status'], { variant: 'success' | 'warning' | 'secondary' | 'error' | 'default'; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'secondary', label: 'Confirmed' },
    checked_in: { variant: 'default', label: 'Checked In' },
    in_progress: { variant: 'success', label: 'In Progress' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    waiting: { variant: 'warning', label: 'Waiting' },
    missed: { variant: 'error', label: 'Missed' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

type TabKey = 'Today' | 'Tomorrow' | 'All' | 'Cancelled' | 'Completed' | 'Missed'

const tabs: TabKey[] = ['Today', 'Tomorrow', 'All', 'Cancelled', 'Completed', 'Missed']

export default function Appointments() {
  const { departments } = useAdminData()
  const [activeTab, setActiveTab] = useState<TabKey>('Today')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const today = '2026-06-30'
  const tomorrow = '2026-07-01'

  const counts = useMemo(() => ({
    today: appointmentsData.filter((a) => a.date === today).length,
    tomorrow: appointmentsData.filter((a) => a.date === tomorrow).length,
    total: appointmentsData.length,
    cancelled: appointmentsData.filter((a) => a.status === 'cancelled').length,
    completed: appointmentsData.filter((a) => a.status === 'completed').length,
    missed: appointmentsData.filter((a) => a.status === 'missed').length,
  }), [])

  const filtered = useMemo(() => {
    let list = [...appointmentsData]
    switch (activeTab) {
      case 'Today': list = list.filter((a) => a.date === today); break
      case 'Tomorrow': list = list.filter((a) => a.date === tomorrow); break
      case 'Cancelled': list = list.filter((a) => a.status === 'cancelled'); break
      case 'Completed': list = list.filter((a) => a.status === 'completed'); break
      case 'Missed': list = list.filter((a) => a.status === 'missed'); break
    }
    if (deptFilter !== 'all') list = list.filter((a) => a.department === deptFilter)
    if (statusFilter !== 'all') list = list.filter((a) => a.status === statusFilter)
    return list
  }, [activeTab, deptFilter, statusFilter])

  const uniqueDepts = Array.from(new Set(appointmentsData.map((a) => a.department)))
  const uniqueStatuses = Array.from(new Set(appointmentsData.map((a) => a.status)))

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
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
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted">Track and manage all patient appointments</p>
        </div>
        <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        <Card className="p-4">
          <p className="text-xs text-muted">Today</p>
          <p className="text-xl font-bold text-foreground">{counts.today}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Tomorrow</p>
          <p className="text-xl font-bold text-foreground">{counts.tomorrow}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Total</p>
          <p className="text-xl font-bold text-foreground">{counts.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Cancelled</p>
          <p className="text-xl font-bold text-foreground text-error">{counts.cancelled}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Completed</p>
          <p className="text-xl font-bold text-foreground text-success">{counts.completed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Missed</p>
          <p className="text-xl font-bold text-foreground text-warning">{counts.missed}</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-secondary text-white shadow-sm'
                        : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="h-9 w-44 text-sm">
                    <Building2 className="h-3.5 w-3.5" />
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-36 text-sm">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map((s) => (
                      <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted">Time</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Patient</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Doctor</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-border transition-colors hover:bg-secondary/5"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted" />
                          <span className="text-foreground">{apt.time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback name={apt.patientName} />
                          </Avatar>
                          <span className="font-medium text-foreground">{apt.patientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{apt.doctorName}</td>
                      <td className="px-4 py-3 text-muted">{apt.department}</td>
                      <td className="px-4 py-3">{statusBadge(apt.status)}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                          Reassign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted">
                No appointments found for this filter.
              </div>
            )}
            <div className="mt-3 text-xs text-muted">
              Showing {filtered.length} of {activeTab === 'All' ? appointmentsData.length : counts[activeTab.toLowerCase() as keyof typeof counts] ?? filtered.length} appointments
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
