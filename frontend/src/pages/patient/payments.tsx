import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Download,
  Smartphone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Receipt,
} from 'lucide-react'
import { usePatientData } from '@/hooks/use-mock-data'
import { StatCard } from '@/components/stat-card'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'
import { ExportButton } from '@/components/export-button'
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

const statusVariant: Record<string, 'success' | 'warning' | 'error'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'error',
}

const methodIcon: Record<string, typeof Smartphone> = {
  mobile_money: Smartphone,
  bank: Building2,
  insurance: ShieldCheck,
}

export default function PatientPayments() {
  const { payments } = usePatientData()
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [provider, setProvider] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [tab, setTab] = useState('outstanding')

  const outstanding = useMemo(() => payments?.filter((p) => p.status === 'pending') ?? [], [payments])
  const paid = useMemo(() => payments?.filter((p) => p.status === 'completed') ?? [], [payments])
  const insurance = useMemo(() => payments?.filter((p) => p.method === 'insurance') ?? [], [payments])

  const outstandingTotal = useMemo(() => outstanding.reduce((s, p) => s + p.amount, 0), [outstanding])
  const paidTotal = useMemo(() => paid.reduce((s, p) => s + p.amount, 0), [paid])
  const insuranceTotal = useMemo(() => insurance.reduce((s, p) => s + p.amount, 0), [insurance])

  function handlePay() {
    setPaying(true)
    setTimeout(() => setPaying(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Payments</h1><p className="mt-1 text-muted-foreground">Manage your payments and insurance</p></div>
        <LoadingSkeleton type="card" count={3} />
        <LoadingSkeleton type="card" />
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
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="mt-1 text-muted-foreground">Manage your payments and insurance</p>
        </div>
        <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Outstanding Balance"
          value={`${outstandingTotal.toLocaleString()} RWF`}
          icon={CreditCard}
          variant="error"
          trend={outstanding.length > 0 ? 100 : 0}
          description="Pending"
        />
        <StatCard
          title="Insurance Coverage"
          value={`${insuranceTotal.toLocaleString()} RWF`}
          icon={ShieldCheck}
          variant="success"
          description="Covered amount"
        />
        <StatCard
          title="Total Paid"
          value={`${paidTotal.toLocaleString()} RWF`}
          icon={Wallet}
          variant="default"
          description="All time"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-secondary" />
              Quick Pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Mobile Money Provider</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setProvider('mtn')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    provider === 'mtn'
                      ? 'border-secondary bg-secondary text-white shadow-sm'
                      : 'border-border bg-card text-foreground hover:border-secondary/50'
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                  MTN Mobile Money
                </button>
                <button
                  onClick={() => setProvider('airtel')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    provider === 'airtel'
                      ? 'border-secondary bg-secondary text-white shadow-sm'
                      : 'border-border bg-card text-foreground hover:border-secondary/50'
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                  Airtel Money
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                placeholder="078X XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Smartphone className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Amount (RWF)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                leftIcon={<Wallet className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Purpose</label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {['Consultation Fee', 'Lab Test', 'Pharmacy', 'Admission Fee', 'Procedure'].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="mt-2 w-full gap-2"
              disabled={paying || !provider || !phone || !amount || !purpose}
              onClick={handlePay}
            >
              {paying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5" />
                  Pay Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="outstanding">Outstanding ({outstanding.length})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
              <TabsTrigger value="insurance">Insurance ({insurance.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="outstanding" className="mt-0">
              {outstanding.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="No outstanding payments" description="All your payments are up to date!" />
              ) : (
                <div className="space-y-3">
                  {outstanding.map((p) => (
                    <PaymentRow key={p.id} payment={p} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="paid" className="mt-0">
              {paid.length === 0 ? (
                <EmptyState icon={Receipt} title="No payment history" description="Your paid transactions will appear here." />
              ) : (
                <div className="space-y-3">
                  {paid.map((p) => (
                    <PaymentRow key={p.id} payment={p} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="insurance" className="mt-0">
              {insurance.length === 0 ? (
                <EmptyState icon={ShieldCheck} title="No insurance claims" description="Insurance-covered payments will appear here." />
              ) : (
                <div className="space-y-3">
                  {insurance.map((p) => (
                    <PaymentRow key={p.id} payment={p} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  )
}

function PaymentRow({ payment: p }: { payment: { id: string; date: string; description: string; amount: number; method: string; provider?: string; status: string; reference: string } }) {
  const Icon = methodIcon[p.method as keyof typeof methodIcon] ?? CreditCard
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
          <Icon className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{p.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{new Date(p.date).toLocaleDateString()}</span>
            <span className="capitalize">{p.method.replace('_', ' ')}</span>
            {p.provider && <span className="uppercase">({p.provider})</span>}
            <span className="font-mono text-xs">{p.reference}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">{p.amount.toLocaleString()} RWF</p>
          <Badge variant={statusVariant[p.status]} className="mt-1 capitalize">
            {p.status === 'completed' ? (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            ) : p.status === 'pending' ? (
              <AlertCircle className="mr-1 h-3 w-3" />
            ) : null}
            {p.status}
          </Badge>
        </div>
        {p.status === 'completed' && (
          <Button variant="ghost" size="sm" className="shrink-0 text-secondary">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
