import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarCheck,
  Clock,
  Plus,
  CalendarClock,
  FileText,
  Dot,
} from 'lucide-react'
import { useDoctorData } from '@/hooks/use-mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const typeLabels: Record<string, string> = {
  consultation: 'General Consultation',
  'follow-up': 'Follow-up',
  checkup: 'Checkup',
  procedure: 'Procedure',
}

const timeSlots = [
  '08:00 - 08:30',
  '08:30 - 09:00',
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '10:30 - 11:00',
  '11:00 - 11:30',
  '11:30 - 12:00',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
  '15:30 - 16:00',
]

const bookedSlots = ['09:00 - 09:30', '10:00 - 10:30', '14:30 - 15:00']

export default function Calendar() {
  const { appointments } = useDoctorData()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d)
    }
    return days
  }, [currentMonth, currentYear, firstDayOfWeek, daysInMonth])

  const selectedDateStr = useMemo(() => {
    const d = selectedDate
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [selectedDate])

  const selectedDayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === selectedDateStr)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDateStr],
  )

  const hasAppointments = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.some((a) => a.date === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    )
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const selectDay = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <div className="mb-1 text-sm font-medium text-secondary">Scheduling</div>
        <h1 className="text-2xl font-bold text-primary">Calendar</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-secondary" />
                  {MONTHS[currentMonth]} {currentYear}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      setCurrentMonth(today.getMonth())
                      setCurrentYear(today.getFullYear())
                      setSelectedDate(today)
                    }}
                  >
                    Today
                  </Button>
                  <Button variant="ghost" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, i) =>
                  day === null ? (
                    <div key={`empty-${i}`} />
                  ) : (
                    <button
                      key={day}
                      onClick={() => selectDay(day)}
                      className={`relative flex flex-col items-center justify-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                        isSelected(day)
                          ? 'bg-secondary text-white shadow-sm'
                          : isToday(day)
                          ? 'bg-secondary/10 text-secondary'
                          : 'hover:bg-secondary/5 text-foreground'
                      }`}
                    >
                      <span>{day}</span>
                      {hasAppointments(day) && (
                        <Dot
                          className={`absolute -bottom-0.5 h-5 w-5 ${
                            isSelected(day) ? 'text-white' : 'text-secondary'
                          }`}
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-secondary" />
                Available Time Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot)
                  return (
                    <div
                      key={slot}
                      className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition-colors ${
                        isBooked
                          ? 'border-border bg-secondary/5 text-muted-foreground line-through'
                          : 'border-border bg-card text-foreground hover:border-secondary/50 hover:bg-secondary/5'
                      }`}
                    >
                      {slot}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-success" />
                    Available
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-secondary/50" />
                    Booked
                  </span>
                </div>
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Add Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-secondary" />
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayAppointments.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No appointments"
                  description="No appointments scheduled for this day."
                />
              ) : (
                <div className="space-y-3">
                  {selectedDayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-secondary/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback name={apt.patientName} />
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {apt.patientName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time}
                          </span>
                          <span>&middot;</span>
                          <span>{typeLabels[apt.type] ?? apt.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-secondary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="lg" className="w-full justify-start gap-3">
                <Plus className="h-4 w-4" />
                Add Appointment
              </Button>
              <Button variant="outline" size="lg" className="w-full justify-start gap-3">
                <CalendarClock className="h-4 w-4" />
                Block Time
              </Button>
              <Button variant="outline" size="lg" className="w-full justify-start gap-3 text-warning border-warning/30 hover:bg-warning/10">
                <FileText className="h-4 w-4" />
                Leave Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}


