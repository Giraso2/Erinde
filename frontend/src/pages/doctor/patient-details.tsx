import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  AlertTriangle,
  ClipboardList,
  Beaker,
  FileText,
  Syringe,
  HeartPulse,
  ChevronRight,
  Stethoscope,
  Pill,
  Thermometer,
} from 'lucide-react'
import { useDoctorData, usePatientData } from '@/hooks/use-mock-data'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoadingSkeleton } from '@/components/loading-skeleton'

const allergies = [
  'Penicillin',
  'Peanuts',
  'Sulfa Drugs',
  'Latex',
]

const diagnoses = [
  {
    date: '2026-05-15',
    title: 'Stage 1 Hypertension',
    doctor: 'Dr. Jean Damascene',
    notes: 'BP 145/95. Prescribed Enalapril 10mg daily. Lifestyle modifications advised.',
  },
  {
    date: '2026-03-22',
    title: 'Upper Respiratory Tract Infection',
    doctor: 'Dr. Marie Goretti',
    notes: 'Prescribed Amoxicillin 500mg for 7 days. Symptoms resolved.',
  },
  {
    date: '2025-12-10',
    title: 'Type 2 Diabetes Screening',
    doctor: 'Dr. Jean Damascene',
    notes: 'Fasting glucose 128 mg/dL. Diet and exercise recommended. Follow-up in 3 months.',
  },
]

const symptoms = [
  { name: 'Persistent Headache', severity: 'Moderate', duration: '2 weeks' },
  { name: 'Fatigue', severity: 'Mild', duration: '1 month' },
  { name: 'Dizziness', severity: 'Moderate', duration: '1 week' },
]

const uploadedDocs = [
  { name: 'Blood Report - May 2026.pdf', type: 'Lab Report', date: '2026-05-20' },
  { name: 'Chest X-Ray Results.pdf', type: 'Imaging', date: '2026-04-15' },
  { name: 'Prescription Refill.pdf', type: 'Prescription', date: '2026-05-01' },
]

const labResults = [
  { test: 'Hemoglobin', result: '13.5', range: '12.0 - 16.0', status: 'normal' },
  { test: 'WBC Count', result: '6,200', range: '4,500 - 11,000', status: 'normal' },
  { test: 'Platelet Count', result: '245,000', range: '150,000 - 450,000', status: 'normal' },
  { test: 'Fasting Glucose', result: '128', range: '70 - 100', status: 'high' },
  { test: 'Cholesterol', result: '220', range: '< 200', status: 'high' },
]

const medicalHistory = [
  { date: '2026-05-15', title: 'Hypertension Diagnosis', doctor: 'Dr. Jean Damascene', notes: 'BP 145/95. Stage 1 hypertension. Enalapril 10mg prescribed.', type: 'diagnosis' },
  { date: '2026-05-15', title: 'Enalapril 10mg', doctor: 'Dr. Jean Damascene', notes: 'One tablet daily. Follow-up in 2 weeks.', type: 'prescription' },
  { date: '2026-04-10', title: 'Complete Blood Count', doctor: 'Dr. Marie Goretti', notes: 'All values within normal range.', type: 'lab_result' },
  { date: '2026-03-22', title: 'Amoxicillin Course', doctor: 'Dr. Marie Goretti', notes: '500mg three times daily for 7 days.', type: 'prescription' },
  { date: '2026-01-05', title: 'COVID-19 Booster', doctor: 'Dr. Samuel Nkusi', notes: 'Moderna booster administered.', type: 'vaccination' },
]

export default function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>()
  const { patients } = useDoctorData()
  const { medicalRecords } = usePatientData()
  const [activeTab, setActiveTab] = useState('overview')

  const patient = useMemo(
    () => patients.find((p) => p.id === patientId) ?? patients[0],
    [patients, patientId],
  )

  if (!patient) {
    return (
      <div className="space-y-6">
        <div className="mb-1 text-sm font-medium text-secondary">Patient Details</div>
        <h1 className="text-2xl font-bold text-primary">Loading...</h1>
        <LoadingSkeleton type="card" count={3} />
      </div>
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
        <Link to="/doctor" className="hover:text-secondary">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/doctor/appointments" className="hover:text-secondary">Appointments</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{patient.name}</span>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback name={patient.name} className="text-lg" />
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  34 years
                </span>
                <span className="flex items-center gap-1">
                  <HeartPulse className="h-3.5 w-3.5" />
                  {patient.condition}
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5" />
                  RSSB Insurance
                </span>
              </div>
            </div>
          </div>
          <Link to={`/doctor/consultation/${patient.id}`}>
            <Button variant="primary" size="lg" className="gap-2">
              <Stethoscope className="h-5 w-5" />
              Start Consultation
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Syringe className="h-4 w-4" />
            Medical History
          </TabsTrigger>
          <TabsTrigger value="lab" className="gap-2">
            <Beaker className="h-4 w-4" />
            Lab Results
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((a) => (
                    <Badge key={a} variant="warning" className="px-3 py-1.5 text-sm">
                      {a}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {symptoms.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between rounded-xl bg-secondary/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-4 w-4 text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">Duration: {s.duration}</p>
                        </div>
                      </div>
                      <Badge variant={s.severity === 'Moderate' ? 'warning' : 'secondary'}>
                        {s.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-secondary" />
                  Previous Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {diagnoses.map((d, i) => (
                    <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                          <div className="h-3 w-3 rounded-full bg-secondary" />
                        </div>
                        {i < diagnoses.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{d.title}</p>
                          <span className="text-xs text-muted-foreground">{d.date}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{d.doctor}</p>
                        <p className="mt-1 text-sm text-foreground">{d.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {uploadedDocs.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} &middot; {doc.date}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {medicalHistory.map((rec) => (
                  <div key={rec.title + rec.date} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl ${
                          rec.type === 'diagnosis' ? 'bg-warning/10 text-warning' :
                          rec.type === 'prescription' ? 'bg-secondary/10 text-secondary' :
                          rec.type === 'lab_result' ? 'bg-success/10 text-success' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {rec.type === 'diagnosis' ? <ClipboardList className="h-4 w-4" /> :
                           rec.type === 'prescription' ? <Pill className="h-4 w-4" /> :
                           rec.type === 'lab_result' ? <Beaker className="h-4 w-4" /> :
                           <Syringe className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.doctor} &middot; {rec.date}</p>
                          <p className="mt-2 text-sm text-foreground">{rec.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-secondary" />
                Lab Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Test</th>
                      <th className="pb-3 font-medium text-muted-foreground">Result</th>
                      <th className="pb-3 font-medium text-muted-foreground">Reference Range</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labResults.map((lab) => (
                      <tr key={lab.test} className="border-b border-border last:border-0">
                        <td className="py-3 font-medium text-foreground">{lab.test}</td>
                        <td className="py-3 text-foreground">{lab.result}</td>
                        <td className="py-3 text-muted-foreground">{lab.range}</td>
                        <td className="py-3">
                          <Badge variant={lab.status === 'normal' ? 'success' : 'warning'}>
                            {lab.status === 'normal' ? 'Normal' : 'High'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                All Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {uploadedDocs.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{doc.date}</span>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
