import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus,
  User,
  Phone,
  Calendar,
  FileText,
  Building2,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Clock,
  MessageSquare,
  Hash,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const departments = [
  'General Consultation',
  'Pediatrics',
  'Emergency',
  'Maternity',
  'Cardiology',
  'Dermatology',
  'Pharmacy',
  'Laboratory',
]

const insuranceProviders = ['CBHI', 'RSSB', 'Private', 'None']

const genderOptions = ['Male', 'Female', 'Other']

const priorityOptions = ['Normal', 'Urgent', 'Emergency']

interface FormData {
  fullName: string
  nationalId: string
  phoneNumber: string
  gender: string
  dateOfBirth: string
  insuranceProvider: string
  visitReason: string
  department: string
  priorityLevel: string
}

interface ConfirmationData {
  queueNumber: string
  estimatedWait: number
  smsSent: boolean
  patientName: string
  department: string
}

const initialForm: FormData = {
  fullName: '',
  nationalId: '',
  phoneNumber: '',
  gender: '',
  dateOfBirth: '',
  insuranceProvider: '',
  visitReason: '',
  department: '',
  priorityLevel: 'Normal',
}

export default function WalkInRegistration() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null)

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setConfirmation({
        queueNumber: `W-${Math.floor(100 + Math.random() * 900)}`,
        estimatedWait: Math.floor(15 + Math.random() * 30),
        smsSent: true,
        patientName: form.fullName,
        department: form.department,
      })
    }, 1500)
  }

  const handleReset = () => {
    setForm(initialForm)
    setConfirmation(null)
  }

  const isFormValid = form.fullName && form.phoneNumber && form.gender && form.dateOfBirth && form.department

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">Walk-in Registration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register a new walk-in patient and assign them to a queue.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="xl:col-span-2"
        >
          <AnimatePresence mode="wait">
            {confirmation ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden border-l-4 border-l-success">
                  <CardHeader className="bg-gradient-to-r from-success/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <CardTitle>Registration Confirmed</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Patient has been registered successfully
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-success/5 p-8 text-center">
                      <Badge variant="success" className="px-3 py-1 text-xs">
                        Assigned Queue Number
                      </Badge>
                      <span className="text-6xl font-bold text-success">
                        {confirmation.queueNumber}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Estimated waiting time: <strong className="text-foreground">{confirmation.estimatedWait} minutes</strong>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                        <Hash className="h-5 w-5 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Patient</p>
                          <p className="text-sm font-medium text-foreground">{confirmation.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                        <Building2 className="h-5 w-5 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <p className="text-sm font-medium text-foreground">{confirmation.department}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-success/30 bg-success/5 p-4">
                      <MessageSquare className="h-5 w-5 text-success" />
                      <span className="text-sm text-foreground">
                        {confirmation.smsSent
                          ? 'SMS confirmation sent to patient phone.'
                          : 'SMS could not be sent. Please inform the patient manually.'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button variant="secondary" size="lg" className="gap-2">
                        <Printer className="h-5 w-5" />
                        Print Queue Ticket
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleReset}>
                        Register Another Patient
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Full Name <span className="text-error">*</span>
                        </label>
                        <Input
                          placeholder="Enter patient full name"
                          value={form.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          leftIcon={<User className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">National ID</label>
                        <Input
                          placeholder="Enter National ID number"
                          value={form.nationalId}
                          onChange={(e) => updateField('nationalId', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Optional but recommended</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Phone Number <span className="text-error">*</span>
                        </label>
                        <Input
                          type="tel"
                          placeholder="+250 7XX XXX XXX"
                          value={form.phoneNumber}
                          onChange={(e) => updateField('phoneNumber', e.target.value)}
                          leftIcon={<Phone className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Gender <span className="text-error">*</span>
                        </label>
                        <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map((g) => (
                              <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Date of Birth <span className="text-error">*</span>
                        </label>
                        <Input
                          type="date"
                          value={form.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                          leftIcon={<Calendar className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Insurance Provider</label>
                        <Select value={form.insuranceProvider} onValueChange={(v) => updateField('insuranceProvider', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance" />
                          </SelectTrigger>
                          <SelectContent>
                            {insuranceProviders.map((p) => (
                              <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Department <span className="text-error">*</span>
                        </label>
                        <Select value={form.department} onValueChange={(v) => updateField('department', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Priority Level</label>
                        <Select value={form.priorityLevel} onValueChange={(v) => updateField('priorityLevel', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((p) => (
                              <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Visit Reason</label>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-0"
                          placeholder="Describe the reason for visit..."
                          value={form.visitReason}
                          onChange={(e) => updateField('visitReason', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Registration Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <UserPlus className="mt-0.5 h-4 w-4 text-secondary shrink-0" />
                <span>Patient will be assigned a walk-in queue number automatically</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-warning shrink-0" />
                <span>Emergency cases should be immediately flagged</span>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-secondary shrink-0" />
                <span>National ID is required for insurance claims</span>
              </div>
            </CardContent>
          </Card>

          {!confirmation && (
            <Button
              variant="primary"
              size="xl"
              className="w-full gap-2"
              disabled={!isFormValid || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
              {submitting ? 'Registering...' : 'Register Patient'}
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
