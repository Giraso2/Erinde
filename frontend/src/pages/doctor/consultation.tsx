import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Send,
  FileText,
  Plus,
  Trash2,
  Stethoscope,
  Calendar,
  HeartPulse,
  AlertTriangle,
  Pill,
  Beaker,
  ClipboardList,
  ChevronRight,
} from 'lucide-react'
import { useDoctorData } from '@/hooks/use-mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSkeleton } from '@/components/loading-skeleton'

interface Medicine {
  name: string
  dosage: string
  duration: string
}

const labTestOptions = [
  'Blood Test',
  'Urine Test',
  'X-Ray',
  'MRI',
  'CT Scan',
  'Malaria Test',
]

const imagingOptions = [
  'X-Ray',
  'Ultrasound',
  'CT',
  'MRI',
]

const hospitals = [
  'CHUK',
  'Kanombe Military Hospital',
  'Kigali University Teaching Hospital',
  'Butare University Teaching Hospital',
  'Rwamagana Provincial Hospital',
]

const departments = [
  'Cardiology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'ENT',
  'Ophthalmology',
]

export default function Consultation() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { patients } = useDoctorData()

  const patient = patients.find((p) => p.id === patientId) ?? patients[0]

  const [diagnosis, setDiagnosis] = useState('')
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([])
  const [selectedImaging, setSelectedImaging] = useState<string[]>([])
  const [referralHospital, setReferralHospital] = useState('')
  const [referralDepartment, setReferralDepartment] = useState('')
  const [referralReason, setReferralReason] = useState('')
  const [newMedicine, setNewMedicine] = useState<Medicine>({ name: '', dosage: '', duration: '' })

  if (!patient) {
    return (
      <div className="space-y-6">
        <div className="mb-1 text-sm font-medium text-secondary">Consultation</div>
        <h1 className="text-2xl font-bold text-primary">Loading...</h1>
        <LoadingSkeleton type="card" count={2} />
      </div>
    )
  }

  const addMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      setMedicines([...medicines, newMedicine])
      setNewMedicine({ name: '', dosage: '', duration: '' })
    }
  }

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const toggleLabTest = (test: string) => {
    setSelectedLabTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test],
    )
  }

  const toggleImaging = (test: string) => {
    setSelectedImaging((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test],
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => navigate('/doctor')} className="hover:text-secondary">Dashboard</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => navigate('/doctor/appointments')} className="hover:text-secondary">Appointments</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Consultation</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-secondary" />
                Patient Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback name={patient.name} className="text-base" />
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">Patient ID: {patient.id}</p>
                </div>
              </div>

              <div className="divide-y divide-border">
                <div className="flex items-center gap-3 py-2">
                  <Calendar className="h-4 w-4 text-muted" />
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="text-sm font-medium text-foreground">34 years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <HeartPulse className="h-4 w-4 text-muted" />
                  <div>
                    <p className="text-xs text-muted-foreground">Condition</p>
                    <p className="text-sm font-medium text-foreground">{patient.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <ClipboardList className="h-4 w-4 text-muted" />
                  <div>
                    <p className="text-xs text-muted-foreground">Insurance</p>
                    <p className="text-sm font-medium text-foreground">RSSB Insurance</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Known Allergies</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="warning">Penicillin</Badge>
                  <Badge variant="warning">Peanuts</Badge>
                  <Badge variant="warning">Sulfa Drugs</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ClipboardList className="h-4 w-4 text-secondary" />
                Recent Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'BP', value: '145/95' },
                  { label: 'HR', value: '78 bpm' },
                  { label: 'Temp', value: '36.8°C' },
                  { label: 'SpO2', value: '98%' },
                ].map((v) => (
                  <div
                    key={v.label}
                    className="rounded-xl bg-secondary/5 px-3 py-2 text-center"
                  >
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                    <p className="text-sm font-semibold text-foreground">{v.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <ClipboardList className="mb-0.5 mr-1.5 inline h-4 w-4 text-secondary" />
                  Diagnosis
                </label>
                <Input
                  placeholder="Enter diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <FileText className="mb-0.5 mr-1.5 inline h-4 w-4 text-secondary" />
                  Clinical Notes
                </label>
                <textarea
                  rows={6}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  placeholder="Enter detailed clinical notes, observations, and recommendations..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    <Pill className="mb-0.5 mr-1.5 inline h-4 w-4 text-secondary" />
                    Prescribe Medicine
                  </label>
                  <Badge variant="secondary">{medicines.length} added</Badge>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  {medicines.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {medicines.map((med, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg bg-secondary/5 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{med.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {med.dosage} &middot; {med.duration}
                            </p>
                          </div>
                          <button
                            onClick={() => removeMedicine(i)}
                            className="rounded-lg p-1 text-muted hover:text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Drug name"
                      className="flex-1"
                      value={newMedicine.name}
                      onChange={(e) =>
                        setNewMedicine({ ...newMedicine, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Dosage"
                      className="w-24"
                      value={newMedicine.dosage}
                      onChange={(e) =>
                        setNewMedicine({ ...newMedicine, dosage: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Duration"
                      className="w-24"
                      value={newMedicine.duration}
                      onChange={(e) =>
                        setNewMedicine({ ...newMedicine, duration: e.target.value })
                      }
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={addMedicine}
                      disabled={!newMedicine.name || !newMedicine.dosage}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    <Beaker className="mb-0.5 mr-1.5 inline h-4 w-4 text-secondary" />
                    Request Lab Tests
                  </label>
                  <div className="space-y-2">
                    {labTestOptions.map((test) => (
                      <label
                        key={test}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 transition-colors hover:bg-secondary/5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLabTests.includes(test)}
                          onChange={() => toggleLabTest(test)}
                          className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                        />
                        <span className="text-sm text-foreground">{test}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    <ClipboardList className="mb-0.5 mr-1.5 inline h-4 w-4 text-secondary" />
                    Request Imaging
                  </label>
                  <div className="space-y-2">
                    {imagingOptions.map((img) => (
                      <label
                        key={img}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 transition-colors hover:bg-secondary/5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedImaging.includes(img)}
                          onChange={() => toggleImaging(img)}
                          className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                        />
                        <span className="text-sm text-foreground">{img}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  <Send className="mb-0.5 mr-1.5 inline h-4 w-4 text-secondary" />
                  Issue Referral
                </label>
                <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Hospital</p>
                      <select
                        value={referralHospital}
                        onChange={(e) => setReferralHospital(e.target.value)}
                        className="h-10 w-full rounded-xl border border-border bg-card px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                      >
                        <option value="">Select hospital</option>
                        {hospitals.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Department</p>
                      <select
                        value={referralDepartment}
                        onChange={(e) => setReferralDepartment(e.target.value)}
                        className="h-10 w-full rounded-xl border border-border bg-card px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                      >
                        <option value="">Select department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    placeholder="Referral reason..."
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="primary" size="lg" className="gap-2">
              <Send className="h-5 w-5" />
              Complete Consultation
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              Generate Digital Prescription
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
