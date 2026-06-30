import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  User,
  Calendar,
  Clock,
  Stethoscope,
  Building2,
  CheckCircle,
  RotateCcw,
  XCircle,
  Printer,
  FileText,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { EmptyState } from '@/components/empty-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'

const searchTabs = [
  { value: 'national-id', label: 'National ID' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'patient-id', label: 'Patient ID' },
  { value: 'appointment-no', label: 'Appointment Number' },
]

const demoPatient = {
  name: 'Alice Uwimana',
  nationalId: '1198 7654 3210 9876',
  phone: '+250 788 555 555',
  patientId: 'P-2024-0042',
  appointmentNo: 'APT-2024-8912',
  date: 'June 30, 2026',
  time: '09:00 AM',
  doctor: 'Dr. Jean Damascene',
  department: 'Cardiology',
  hospital: 'CHUK - Kigali',
  status: 'confirmed' as const,
}

export default function VerifyAppointment() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('national-id')
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
    }, 1200)
  }

  const statusVariant = demoPatient.status === 'confirmed' ? 'success' : demoPatient.status === 'pending' ? 'warning' : 'default'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">Verify Appointment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for an appointment to verify and check in the patient.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Search Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={searchType} onValueChange={setSearchType}>
              <TabsList className="w-full sm:w-auto">
                {searchTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {searchTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder={`Enter ${tab.label.toLowerCase()}...`}
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
                      {searching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
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
        {searching && <LoadingSkeleton type="card" />}

        {searched && !searching && !found && (
          <EmptyState
            icon={FileText}
            title="No Appointment Found"
            description="No appointment matches your search. Try a different search term or register a new patient."
            action={{ label: 'Register New Patient', onClick: () => {} }}
          />
        )}

        {searched && !searching && found && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-l-4 border-l-secondary overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
                      <User className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{demoPatient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Patient ID: {demoPatient.patientId}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant} className="px-4 py-1.5 text-sm capitalize">
                    {demoPatient.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3 rounded-2xl bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Appointment Date</span>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">{demoPatient.date}</p>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Appointment Time</span>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">{demoPatient.time}</p>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Doctor</span>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">{demoPatient.doctor}</p>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-surface p-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Department</span>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">{demoPatient.department}</p>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-surface p-4 sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">Hospital</span>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">{demoPatient.hospital}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Check In
                  </Button>
                  <Button variant="primary" size="lg" className="gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Reschedule
                  </Button>
                  <Button variant="danger" size="lg" className="gap-2">
                    <XCircle className="h-5 w-5" />
                    Cancel
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Printer className="h-5 w-5" />
                    Print Appointment Slip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!searched && (
          <EmptyState
            icon={Search}
            title="Search for an Appointment"
            description="Enter a National ID, Phone Number, Patient ID, or Appointment Number to verify and check in a patient."
          />
        )}
      </motion.div>
    </motion.div>
  )
}
