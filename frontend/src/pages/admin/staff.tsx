import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Stethoscope, UserPlus, LayoutGrid, List,
  Filter, X, Save,
} from 'lucide-react'
import { useAdminData } from '@/hooks/use-mock-data'
import type { Staff } from '@/types'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const roleLabels: Record<Staff['role'], string> = {
  doctor: 'Doctors',
  nurse: 'Nurses',
  receptionist: 'Receptionists',
  lab: 'Lab',
  pharmacist: 'Pharmacists',
}

const roleTabs = ['All', 'Doctors', 'Nurses', 'Receptionists', 'Lab', 'Pharmacists'] as const

type RoleTab = typeof roleTabs[number]

const roleFilterMap: Record<RoleTab, Staff['role'] | null> = {
  All: null,
  Doctors: 'doctor',
  Nurses: 'nurse',
  Receptionists: 'receptionist',
  Lab: 'lab',
  Pharmacists: 'pharmacist',
}

const statusBadge = (status: Staff['status']) => {
  const map: Record<Staff['status'], { variant: 'success' | 'warning' | 'error'; label: string }> = {
    on_duty: { variant: 'success', label: 'On Duty' },
    off_duty: { variant: 'warning', label: 'Off Duty' },
    on_leave: { variant: 'error', label: 'On Leave' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

const roleIcon = (role: Staff['role']) => {
  switch (role) {
    case 'doctor': return Stethoscope
    default: return Users
  }
}

export default function StaffManagement() {
  const { staff: initialStaff } = useAdminData()
  const [staffList, setStaffList] = useState(initialStaff)
  const [activeTab, setActiveTab] = useState<RoleTab>('All')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'doctor' as Staff['role'],
    department: '',
    schedule: '08:00 - 17:00',
  })

  const filteredStaff = staffList.filter((s) => {
    const roleMatch = !roleFilterMap[activeTab] || s.role === roleFilterMap[activeTab]
    const searchMatch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.department.toLowerCase().includes(searchQuery.toLowerCase())
    return roleMatch && searchMatch
  })

  const toggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const next: Record<Staff['status'], Staff['status']> = {
          on_duty: 'off_duty',
          off_duty: 'on_leave',
          on_leave: 'on_duty',
        }
        return { ...s, status: next[s.status] }
      }),
    )
  }

  const addStaff = () => {
    if (!newStaff.name || !newStaff.department) return
    const entry: Staff = {
      id: `st-${Date.now()}`,
      name: newStaff.name,
      role: newStaff.role,
      department: newStaff.department,
      status: 'on_duty',
      schedule: newStaff.schedule,
    }
    setStaffList((prev) => [...prev, entry])
    setNewStaff({ name: '', role: 'doctor', department: '', schedule: '08:00 - 17:00' })
    setDialogOpen(false)
  }

  const counts = {
    total: staffList.length,
    doctors: staffList.filter((s) => s.role === 'doctor').length,
    nurses: staffList.filter((s) => s.role === 'nurse').length,
    lab: staffList.filter((s) => s.role === 'lab').length,
    pharmacists: staffList.filter((s) => s.role === 'pharmacist').length,
  }

  const onDuty = staffList.filter((s) => s.status === 'on_duty').length

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={3} />
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
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted">Manage hospital staff, schedules, and assignments</p>
        </div>
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add Staff
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <StatCard title="Total Staff" value={counts.total} icon={Users} variant="default" />
        <StatCard title="Doctors on Duty" value={counts.doctors} icon={Stethoscope} variant="default" />
        <StatCard title="Nurses" value={counts.nurses} icon={Users} variant="success" />
        <StatCard title="Lab Staff" value={counts.lab} icon={Users} variant="warning" />
        <StatCard title="Pharmacists" value={counts.pharmacists} icon={Users} variant="default" />
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
                {roleTabs.map((tab) => (
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
                    {tab !== 'All' && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({counts[roleFilterMap[tab]! as keyof typeof counts] ?? 0})
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-48 text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                >
                  {viewMode === 'list' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-medium text-muted">Staff</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Department</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Schedule</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((staff) => (
                      <tr
                        key={staff.id}
                        className="border-b border-border transition-colors hover:bg-secondary/5"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback name={staff.name} />
                            </Avatar>
                            <span className="font-medium text-foreground">{staff.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted">{roleLabels[staff.role]}</td>
                        <td className="px-4 py-3 text-foreground">{staff.department}</td>
                        <td className="px-4 py-3">{statusBadge(staff.status)}</td>
                        <td className="px-4 py-3 text-foreground">{staff.schedule}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(staff.id)}
                          >
                            <Filter className="h-4 w-4" />
                            Toggle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredStaff.map((staff) => (
                  <Card key={staff.id} className="p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg">
                        <AvatarFallback name={staff.name} />
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{staff.name}</p>
                        <p className="text-xs text-muted">{roleLabels[staff.role]} &middot; {staff.department}</p>
                        <div className="mt-1">{statusBadge(staff.status)}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs text-muted">{staff.schedule}</span>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(staff.id)} className="text-xs">
                        Toggle
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {filteredStaff.length === 0 && (
              <div className="py-12 text-center text-sm text-muted">
                No staff members match your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
              <Input
                placeholder="Enter full name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
              <div className="flex flex-wrap gap-2">
                {(['doctor', 'nurse', 'receptionist', 'lab', 'pharmacist'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setNewStaff({ ...newStaff, role })}
                    className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                      newStaff.role === role
                        ? 'bg-secondary text-white shadow-sm'
                        : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                    }`}
                  >
                    {roleLabels[role]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Department</label>
              <Input
                placeholder="e.g. Cardiology"
                value={newStaff.department}
                onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Schedule</label>
              <Input
                placeholder="e.g. 08:00 - 17:00"
                value={newStaff.schedule}
                onChange={(e) => setNewStaff({ ...newStaff, schedule: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button variant="primary" onClick={addStaff}>
              <Save className="h-4 w-4" />
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
