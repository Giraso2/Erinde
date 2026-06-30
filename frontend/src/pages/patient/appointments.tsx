import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  User,
  Hospital,
  Building2,
  XCircle,
  CheckCircle2,
  AlertCircle,
  CalendarX2,
  Loader2,
} from 'lucide-react'
import { usePatientData } from '@/hooks/use-mock-data'
import { StatCard } from '@/components/stat-card'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const districts = ['Kigali', 'Kicukiro', 'Nyarugenge', 'Huye', 'Rwamagana', 'Musanze']

const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

const bookedSlots = ['08:00', '09:00', '11:00', '12:30', '14:00', '15:30']

const statusVariant: Record<string, 'success' | 'warning' | 'default' | 'error' | 'secondary'> = {
  confirmed: 'success',
  pending: 'warning',
  checked_in: 'secondary',
  in_progress: 'secondary',
  completed: 'default',
  cancelled: 'error',
}

export default function PatientAppointments() {
  const { appointments } = usePatientData()
  const [loading, setLoading] = useState(false)
  const [district, setDistrict] = useState('')
  const [hospital, setHospital] = useState('')
  const [department, setDepartment] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [tab, setTab] = useState('upcoming')

  const upcoming = useMemo(() => appointments?.filter((a) => a.status !== 'cancelled' && a.status !== 'completed') ?? [], [appointments])
  const past = useMemo(() => appointments?.filter((a) => a.status === 'completed') ?? [], [appointments])
  const cancelled = useMemo(() => appointments?.filter((a) => a.status === 'cancelled') ?? [], [appointments])

  const hospitalsByDistrict = useMemo(() => {
    const map: Record<string, string[]> = {
      Kigali: ['CHUK', 'Kigali University Teaching Hospital'],
      Kicukiro: ['Kanombe Military Hospital'],
      Nyarugenge: ['Kigali University Teaching Hospital'],
      Huye: ['Butare University Teaching Hospital'],
      Rwamagana: ['Rwamagana Provincial Hospital'],
      Musanze: ['Musanze District Hospital'],
    }
    return map[district] ?? []
  }, [district])

  const availableSlots = timeSlots.filter((s) => !bookedSlots.includes(s))

  function handleBook() {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="mt-1 text-muted-foreground">Book and manage your appointments</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming" value={upcoming.length} icon={Calendar} variant="default" />
        <StatCard title="Completed" value={past.length} icon={CheckCircle2} variant="success" />
        <StatCard title="Cancelled" value={cancelled.length} icon={CalendarX2} variant="error" />
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">District</label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Hospital</label>
                <Select value={hospital} onValueChange={setHospital} disabled={!district}>
                  <SelectTrigger>
                    <SelectValue placeholder={district ? 'Select hospital' : 'Select district first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalsByDistrict.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {['General Consultation', 'Pediatrics', 'Cardiology', 'Maternity', 'Dermatology', 'Laboratory'].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Doctor (optional)</label>
                <Select value={doctor} onValueChange={setDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any available doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Dr. Jean Damascene', 'Dr. Alice Benishyaka', 'Dr. Eric Niyonzima', 'Dr. Marie Goretti'].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                        selectedSlot === slot
                          ? 'border-secondary bg-secondary text-white shadow-sm'
                          : 'border-border bg-card text-foreground hover:border-secondary/50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="mt-4 w-full gap-2"
                disabled={loading || !district || !hospital || !department || !date || !selectedSlot}
                onClick={handleBook}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-0 space-y-3">
                {upcoming.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No upcoming appointments"
                    description="Book your first appointment to get started."
                    action={{ label: 'Book Now', onClick: () => {} }}
                  />
                ) : (
                  upcoming.map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hospital className="h-5 w-5 text-secondary" />
                            <span className="font-semibold text-foreground">{apt.hospitalName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {apt.doctorName}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" /> {apt.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" /> {apt.department}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={statusVariant[apt.status]} className="capitalize">
                            {apt.status.replace('_', ' ')}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-error hover:text-error">
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-0 space-y-3">
                {past.length === 0 ? (
                  <EmptyState icon={CheckCircle2} title="No past appointments" description="Completed appointments will appear here." />
                ) : (
                  past.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-soft opacity-70"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hospital className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{apt.hospitalName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {apt.doctorName}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {apt.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.time}</span>
                          </div>
                        </div>
                        <Badge variant={statusVariant[apt.status]} className="capitalize">
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-0 space-y-3">
                {cancelled.length === 0 ? (
                  <EmptyState icon={CalendarX2} title="No cancelled appointments" description="You haven't cancelled any appointments." />
                ) : (
                  cancelled.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-soft opacity-70"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hospital className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{apt.hospitalName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {apt.doctorName}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {apt.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.time}</span>
                          </div>
                        </div>
                        <Badge variant="error">Cancelled</Badge>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </motion.div>
  )
}
