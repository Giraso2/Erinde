import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Stethoscope,
  Users,
  Coffee,
  Moon,
  Clock,
  UserPlus,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/loading-skeleton'

interface DoctorCard {
  id: string
  name: string
  specialty: string
  department: string
  status: 'available' | 'in_consultation' | 'on_break' | 'off_duty'
  estimatedAvailable?: string
  breakEnd?: string
}

const doctorsData: DoctorCard[] = [
  { id: 'd1', name: 'Dr. Jean Damascene', specialty: 'Cardiologist', department: 'Cardiology', status: 'available' },
  { id: 'd2', name: 'Dr. Alice Benishyaka', specialty: 'Pediatrician', department: 'Pediatrics', status: 'in_consultation', estimatedAvailable: '~15 min' },
  { id: 'd3', name: 'Dr. Eric Niyonzima', specialty: 'Emergency Physician', department: 'Emergency', status: 'available' },
  { id: 'd4', name: 'Dr. Marie Goretti', specialty: 'Gynecologist', department: 'Maternity', status: 'on_break', breakEnd: '2:30 PM' },
  { id: 'd5', name: 'Dr. John Mugabo', specialty: 'General Practitioner', department: 'General Consultation', status: 'available' },
  { id: 'd6', name: 'Dr. Olive Uwamahoro', specialty: 'Dermatologist', department: 'Dermatology', status: 'off_duty' },
  { id: 'd7', name: 'Dr. Samuel Nkusi', specialty: 'Infectious Disease', department: 'General Consultation', status: 'in_consultation', estimatedAvailable: '~25 min' },
  { id: 'd8', name: 'Dr. Beatrice Mukantabana', specialty: 'Pathologist', department: 'Laboratory', status: 'available' },
  { id: 'd9', name: 'Dr. David Hakizimana', specialty: 'Cardiologist', department: 'Cardiology', status: 'off_duty' },
  { id: 'd10', name: 'Dr. Chantal Nyiraneza', specialty: 'Emergency Physician', department: 'Emergency', status: 'available' },
  { id: 'd11', name: 'Dr. Emmanuel Ndayisaba', specialty: 'General Practitioner', department: 'General Consultation', status: 'on_break', breakEnd: '3:00 PM' },
  { id: 'd12', name: 'Dr. Grace Uwimana', specialty: 'Pediatrician', department: 'Pediatrics', status: 'in_consultation', estimatedAvailable: '~10 min' },
]

const statusConfig: Record<string, {
  label: string
  borderColor: string
  badgeVariant: 'success' | 'secondary' | 'warning' | 'outline'
  icon: typeof Stethoscope
  iconBg: string
}> = {
  available: {
    label: 'Available',
    borderColor: 'border-l-success',
    badgeVariant: 'success',
    icon: CheckCircle2,
    iconBg: 'bg-success/10 text-success',
  },
  in_consultation: {
    label: 'In Consultation',
    borderColor: 'border-l-secondary',
    badgeVariant: 'secondary',
    icon: Stethoscope,
    iconBg: 'bg-secondary/10 text-secondary',
  },
  on_break: {
    label: 'On Break',
    borderColor: 'border-l-warning',
    badgeVariant: 'warning',
    icon: Coffee,
    iconBg: 'bg-warning/10 text-warning',
  },
  off_duty: {
    label: 'Off Duty',
    borderColor: 'border-l-muted',
    badgeVariant: 'outline',
    icon: Moon,
    iconBg: 'bg-muted/10 text-muted',
  },
}

export default function DoctorDirectory() {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = filter === 'all'
    ? doctorsData
    : doctorsData.filter((d) => d.status === filter)

  const counts = {
    available: doctorsData.filter((d) => d.status === 'available').length,
    in_consultation: doctorsData.filter((d) => d.status === 'in_consultation').length,
    on_break: doctorsData.filter((d) => d.status === 'on_break').length,
    off_duty: doctorsData.filter((d) => d.status === 'off_duty').length,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">Doctor Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View doctor availability and assign patients.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-l-4 border-l-success cursor-pointer transition-shadow hover:shadow-md" onClick={() => setFilter('all')}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-foreground">{counts.available}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary cursor-pointer transition-shadow hover:shadow-md" onClick={() => setFilter('in_consultation')}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
              <Stethoscope className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Consultation</p>
              <p className="text-2xl font-bold text-foreground">{counts.in_consultation}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning cursor-pointer transition-shadow hover:shadow-md" onClick={() => setFilter('on_break')}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10">
              <Coffee className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">On Break</p>
              <p className="text-2xl font-bold text-foreground">{counts.on_break}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-muted cursor-pointer transition-shadow hover:shadow-md" onClick={() => setFilter('off_duty')}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/10">
              <Moon className="h-6 w-6 text-muted" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Off Duty</p>
              <p className="text-2xl font-bold text-foreground">{counts.off_duty}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({doctorsData.length})
          </Button>
          <Button
            variant={filter === 'available' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('available')}
            className="border-l-success"
          >
            Available
          </Button>
          <Button
            variant={filter === 'in_consultation' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('in_consultation')}
          >
            In Consultation
          </Button>
          <Button
            variant={filter === 'on_break' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('on_break')}
          >
            On Break
          </Button>
          <Button
            variant={filter === 'off_duty' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('off_duty')}
          >
            Off Duty
          </Button>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((doctor, index) => {
              const config = statusConfig[doctor.status]
              const StatusIcon = config.icon
              return (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className={`border-l-4 overflow-hidden transition-shadow hover:shadow-md ${config.borderColor}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar size="lg">
                            <AvatarFallback name={doctor.name} />
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          </div>
                        </div>
                        <Badge variant={config.badgeVariant} className="text-[10px] px-2 py-0.5">
                          {config.label}
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {doctor.department}
                      </div>

                      {doctor.status === 'in_consultation' && doctor.estimatedAvailable && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
                          <Clock className="h-3.5 w-3.5" />
                          Available: {doctor.estimatedAvailable}
                        </div>
                      )}

                      {doctor.status === 'on_break' && doctor.breakEnd && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-warning">
                          <Coffee className="h-3.5 w-3.5" />
                          Back at: {doctor.breakEnd}
                        </div>
                      )}

                      {doctor.status === 'available' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4 w-full gap-1.5"
                        >
                          <UserPlus className="h-4 w-4" />
                          Assign Patient
                        </Button>
                      )}

                      {doctor.status !== 'available' && (
                        <div className={`mt-4 flex items-center gap-2 rounded-xl p-2.5 ${config.iconBg}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {doctor.status === 'in_consultation' && 'Currently consulting a patient'}
                            {doctor.status === 'on_break' && 'On break'}
                            {doctor.status === 'off_duty' && 'Not on duty today'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Users className="mb-3 h-10 w-10" />
            <p className="text-sm">No doctors found in this category.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
