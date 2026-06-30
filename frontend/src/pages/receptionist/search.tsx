import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  User,
  Calendar,
  Phone,
  Fingerprint,
  Hash,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  History,
  UserCheck,
  Plus,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/empty-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'

const searchByOptions = [
  { value: 'national-id', label: 'National ID' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'patient-id', label: 'Patient Number' },
  { value: 'name', label: 'Name' },
]

const mockPatient = {
  name: 'Alice Uwimana',
  dateOfBirth: 'March 15, 1990',
  gender: 'Female',
  phone: '+250 788 555 555',
  nationalId: '1198 7654 3210 9876',
  mrn: 'MRN-2024-0042',
  insuranceProvider: 'CBHI',
  coverage: 85,
  insuranceStatus: 'Active' as const,
  outstandingBills: 25000,
}

const appointmentHistory = [
  { date: 'Jun 30, 2026', doctor: 'Dr. Jean Damascene', department: 'Cardiology', hospital: 'CHUK', status: 'confirmed' as const },
  { date: 'Jun 28, 2026', doctor: 'Dr. Alice Benishyaka', department: 'Pediatrics', hospital: 'KUTH', status: 'completed' as const },
  { date: 'Jun 15, 2026', doctor: 'Dr. Eric Niyonzima', department: 'Emergency', hospital: 'CHUK', status: 'completed' as const },
  { date: 'Jun 02, 2026', doctor: 'Dr. Marie Goretti', department: 'Maternity', hospital: 'Kanombe Military', status: 'missed' as const },
]

export default function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBy, setSearchBy] = useState('national-id')
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [found, setFound] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearched(true)
    setTimeout(() => {
      setSearching(false)
      setFound(true)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">Patient Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for a patient by National ID, Phone Number, Patient Number, or Name.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Search Patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={searchBy} onValueChange={setSearchBy}>
              <TabsList className="w-full sm:w-auto">
                {searchByOptions.map((opt) => (
                  <TabsTrigger key={opt.value} value={opt.value}>
                    {opt.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {searchByOptions.map((opt) => (
                <TabsContent key={opt.value} value={opt.value}>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder={`Enter ${opt.label.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        leftIcon={<Search className="h-4 w-4" />}
                        className="h-12 text-base"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSearch}
                      disabled={searching || !searchQuery.trim()}
                      className="gap-2"
                    >
                      <Search className="h-5 w-5" />
                      Search
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {searching && <LoadingSkeleton type="card" count={2} />}

        {searched && !searching && !found && (
          <EmptyState
            icon={Search}
            title="Patient Not Found"
            description="No patient matches your search criteria. Please try a different search term or register a new patient."
            action={{ label: 'Register New Patient', onClick: () => {} }}
          />
        )}

        {searched && !searching && found && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                      <User className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="text-sm font-medium text-foreground">{mockPatient.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date of Birth</p>
                        <p className="text-sm font-medium text-foreground">{mockPatient.dateOfBirth}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                      <User className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="text-sm font-medium text-foreground">{mockPatient.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                      <Phone className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="text-sm font-medium text-foreground">{mockPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                      <Fingerprint className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">National ID</p>
                        <p className="text-sm font-medium text-foreground">{mockPatient.nationalId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                      <Hash className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">MRN</p>
                        <p className="text-sm font-medium text-foreground">{mockPatient.mrn}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Insurance Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Provider</span>
                      <span className="text-sm font-medium text-foreground">{mockPatient.insuranceProvider}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="success">{mockPatient.insuranceStatus}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Coverage</span>
                        <span className="text-sm font-medium text-foreground">{mockPatient.coverage}%</span>
                      </div>
                      <Progress value={mockPatient.coverage} variant="success" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Outstanding Bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-error" />
                      <span className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(mockPatient.outstandingBills)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Hospital</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentHistory.map((apt, index) => (
                        <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/5">
                          <td className="px-6 py-4 text-sm text-foreground">{apt.date}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{apt.doctor}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{apt.department}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{apt.hospital}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                apt.status === 'confirmed' ? 'secondary' :
                                apt.status === 'completed' ? 'success' :
                                apt.status === 'missed' ? 'error' : 'default'
                              }
                              className="capitalize"
                            >
                              {apt.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" className="gap-2">
                <UserCheck className="h-5 w-5" />
                Check In
              </Button>
              <Button variant="primary" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Appointment
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <History className="h-5 w-5" />
                View Full History
              </Button>
            </div>
          </motion.div>
        )}

        {!searched && (
          <EmptyState
            icon={Search}
            title="Search for a Patient"
            description="Use the search bar above to find a patient by National ID, Phone Number, Patient Number, or Name."
          />
        )}
      </motion.div>
    </motion.div>
  )
}
