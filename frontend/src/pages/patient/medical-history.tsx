import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Stethoscope,
  Beaker,
  Pill,
  Syringe,
  Calendar,
  User,
  Hospital,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { usePatientData } from '@/hooks/use-mock-data'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'
import { ExportButton } from '@/components/export-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const tabIcons: Record<string, typeof ClipboardList> = {
  appointments: ClipboardList,
  diagnoses: Stethoscope,
  lab_results: Beaker,
  prescriptions: Pill,
  vaccinations: Syringe,
}

const labResults = [
  { id: 'lr-1', test: 'Hemoglobin', value: '13.5', range: '12.0 - 16.0', unit: 'g/dL', status: 'normal' as const },
  { id: 'lr-2', test: 'White Blood Cells', value: '6,200', range: '4,500 - 11,000', unit: '/mL', status: 'normal' as const },
  { id: 'lr-3', test: 'Blood Glucose', value: '142', range: '70 - 120', unit: 'mg/dL', status: 'abnormal' as const },
  { id: 'lr-4', test: 'Platelets', value: '245,000', range: '150,000 - 450,000', unit: '/mL', status: 'normal' as const },
  { id: 'lr-5', test: 'Cholesterol', value: '210', range: '< 200', unit: 'mg/dL', status: 'abnormal' as const },
]

const prescriptions = [
  { id: 'pr-1', medicine: 'Enalapril 10mg', dosage: '1 tablet daily', duration: '30 days', prescriber: 'Dr. Jean Damascene', date: '2024-05-15', refills: 2 },
  { id: 'pr-2', medicine: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily', duration: '7 days', prescriber: 'Dr. Marie Goretti', date: '2024-05-10', refills: 0 },
  { id: 'pr-3', medicine: 'Paracetamol 500mg', dosage: '2 tablets as needed', duration: '5 days', prescriber: 'Dr. Alice Benishyaka', date: '2024-04-28', refills: 3 },
]

export default function PatientMedicalHistory() {
  const { medicalRecords } = usePatientData()
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState('diagnoses')

  const diagnoses = useMemo(() => medicalRecords?.filter((r) => r.type === 'diagnosis') ?? [], [medicalRecords])
  const vaccinations = useMemo(() => medicalRecords?.filter((r) => r.type === 'vaccination') ?? [], [medicalRecords])

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Medical History</h1><p className="mt-1 text-muted-foreground">Your complete medical records</p></div>
        <LoadingSkeleton type="list" count={2} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medical History</h1>
          <p className="mt-1 text-muted-foreground">Your complete medical records</p>
        </div>
        <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 flex-wrap">
          {['appointments', 'diagnoses', 'lab_results', 'prescriptions', 'vaccinations'].map((t) => {
            const Icon = tabIcons[t]
            return (
              <TabsTrigger key={t} value={t} className="gap-1.5 capitalize">
                <Icon className="h-4 w-4" />
                {t.replace('_', ' ')}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="appointments" className="mt-0">
          <RecordList
            records={medicalRecords ?? []}
            expandedId={expandedId}
            onToggle={setExpandedId}
            emptyIcon={ClipboardList}
            emptyTitle="No appointment records"
            emptyDesc="Your appointment history will appear here."
          />
        </TabsContent>

        <TabsContent value="diagnoses" className="mt-0">
          <RecordList
            records={diagnoses}
            expandedId={expandedId}
            onToggle={setExpandedId}
            emptyIcon={Stethoscope}
            emptyTitle="No diagnoses"
            emptyDesc="Your diagnostic records will appear here."
          />
        </TabsContent>

        <TabsContent value="lab_results" className="mt-0">
          <div className="space-y-3">
            {labResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{result.test}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        <span className="font-semibold text-foreground">{result.value}</span> {result.unit}
                      </span>
                      <span>Ref: {result.range} {result.unit}</span>
                    </div>
                  </div>
                  <Badge variant={result.status === 'normal' ? 'success' : 'error'} className="capitalize">
                    {result.status === 'normal' ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    {result.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
            {labResults.length === 0 && (
              <EmptyState icon={Beaker} title="No lab results" description="Your laboratory results will appear here." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-0">
          <div className="space-y-3">
            {prescriptions.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-secondary" />
                      <span className="font-semibold text-foreground">{p.medicine}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <span className="text-muted-foreground">Dosage:</span>
                      <span className="font-medium text-foreground">{p.dosage}</span>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">{p.duration}</span>
                      <span className="text-muted-foreground">Prescriber:</span>
                      <span className="font-medium text-foreground">{p.prescriber}</span>
                      <span className="text-muted-foreground">Refills:</span>
                      <span className="font-medium text-foreground">{p.refills} remaining</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">{p.date}</div>
                </div>
              </motion.div>
            ))}
            {prescriptions.length === 0 && (
              <EmptyState icon={Pill} title="No prescriptions" description="Your prescriptions will appear here." />
            )}
          </div>
        </TabsContent>

        <TabsContent value="vaccinations" className="mt-0">
          <RecordList
            records={vaccinations}
            expandedId={expandedId}
            onToggle={setExpandedId}
            emptyIcon={Syringe}
            emptyTitle="No vaccinations"
            emptyDesc="Your vaccination records will appear here."
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

interface RecordListProps {
  records: Array<{ id: string; type: string; title: string; doctorName: string; date: string; notes: string }>
  expandedId: string | null
  onToggle: (id: string | null) => void
  emptyIcon: typeof FileText
  emptyTitle: string
  emptyDesc: string
}

function RecordList({ records, expandedId, onToggle, emptyIcon, emptyTitle, emptyDesc }: RecordListProps) {
  if (records.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDesc} />
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const isExpanded = expandedId === record.id
        return (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card shadow-soft transition-all hover:shadow-md"
          >
            <button
              onClick={() => onToggle(isExpanded ? null : record.id)}
              className="flex w-full items-start justify-between p-5 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <Stethoscope className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{record.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {record.doctorName}
                    </span>
                    <Badge variant="default" className="capitalize text-xs">
                      {record.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-muted-foreground">
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-5 pb-5 pt-3">
                    <div className="rounded-xl bg-secondary/5 p-4">
                      <p className="text-sm leading-relaxed text-foreground">{record.notes}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
