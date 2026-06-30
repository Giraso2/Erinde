import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, ShieldCheck, Clock, CheckCircle2,
  BarChart3, Phone, Download,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ExportButton } from '@/components/export-button'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  date: string
  reference: string
  patient: string
  description: string
  amount: number
  method: 'cash' | 'insurance' | 'mobile_money'
  status: 'completed' | 'pending' | 'failed'
}

const transactions: Transaction[] = [
  { id: 'tx-1', date: '2026-06-30', reference: 'REF-2026-001', patient: 'Alice Uwimana', description: 'Consultation - Cardiology', amount: 15000, method: 'mobile_money', status: 'completed' },
  { id: 'tx-2', date: '2026-06-30', reference: 'REF-2026-002', patient: 'Jean Marie Vianney', description: 'Lab Test - Blood Work', amount: 8500, method: 'cash', status: 'completed' },
  { id: 'tx-3', date: '2026-06-30', reference: 'REF-2026-003', patient: 'Frida Mukamana', description: 'Pharmacy - Prescription', amount: 25000, method: 'insurance', status: 'pending' },
  { id: 'tx-4', date: '2026-06-29', reference: 'REF-2026-004', patient: 'Eric Mugisha', description: 'Maternity Services', amount: 120000, method: 'insurance', status: 'completed' },
  { id: 'tx-5', date: '2026-06-29', reference: 'REF-2026-005', patient: 'Marie Claire Uwase', description: 'Dermatology Consultation', amount: 18000, method: 'mobile_money', status: 'completed' },
  { id: 'tx-6', date: '2026-06-29', reference: 'REF-2026-006', patient: 'Patrick Habimana', description: 'Emergency Services', amount: 45000, method: 'cash', status: 'completed' },
  { id: 'tx-7', date: '2026-06-28', reference: 'REF-2026-007', patient: 'Diane Umubyeyi', description: 'Pharmacy - Chronic Meds', amount: 32000, method: 'mobile_money', status: 'failed' },
  { id: 'tx-8', date: '2026-06-28', reference: 'REF-2026-008', patient: 'Jean Pierre Niyonzima', description: 'Lab Test - Malaria', amount: 5000, method: 'insurance', status: 'completed' },
  { id: 'tx-9', date: '2026-06-28', reference: 'REF-2026-009', patient: 'Grace Uwimana', description: 'Pediatric Consultation', amount: 12000, method: 'mobile_money', status: 'pending' },
  { id: 'tx-10', date: '2026-06-27', reference: 'REF-2026-010', patient: 'Olivier Niyomugabo', description: 'Cardiology - ECG', amount: 35000, method: 'insurance', status: 'completed' },
  { id: 'tx-11', date: '2026-06-27', reference: 'REF-2026-011', patient: 'Chantal Nyiraneza', description: 'Prescription Refill', amount: 7500, method: 'mobile_money', status: 'completed' },
  { id: 'tx-12', date: '2026-06-27', reference: 'REF-2026-012', patient: 'David Hakizimana', description: 'General Consultation', amount: 10000, method: 'cash', status: 'completed' },
]

const monthlyRevenueData = [
  { month: 'Jan', revenue: 38500000 },
  { month: 'Feb', revenue: 41200000 },
  { month: 'Mar', revenue: 39800000 },
  { month: 'Apr', revenue: 42500000 },
  { month: 'May', revenue: 44700000 },
  { month: 'Jun', revenue: 46200000 },
  { month: 'Jul', revenue: 43800000 },
  { month: 'Aug', revenue: 47100000 },
  { month: 'Sep', revenue: 45500000 },
  { month: 'Oct', revenue: 48300000 },
  { month: 'Nov', revenue: 49600000 },
  { month: 'Dec', revenue: 51200000 },
]

const mobileMoneyReconciliation = [
  { provider: 'MTN Mobile Money', transactions: 342, settled: 329, pending: 13, amount: 2985000 },
  { provider: 'Airtel Money', transactions: 187, settled: 179, pending: 8, amount: 1452000 },
]

const statusBadge = (status: Transaction['status']) => {
  const map: Record<Transaction['status'], { variant: 'success' | 'warning' | 'error'; label: string }> = {
    completed: { variant: 'success', label: 'Completed' },
    pending: { variant: 'warning', label: 'Pending' },
    failed: { variant: 'error', label: 'Failed' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

type TabKey = 'All Transactions' | 'Insurance' | 'Mobile Money'

export default function Finance() {
  const [activeTab, setActiveTab] = useState<TabKey>('All Transactions')
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    switch (activeTab) {
      case 'Insurance': return transactions.filter((t) => t.method === 'insurance')
      case 'Mobile Money': return transactions.filter((t) => t.method === 'mobile_money')
      default: return transactions
    }
  }, [activeTab])

  const totalRevenue = transactions.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const insuranceClaims = transactions.filter((t) => t.method === 'insurance').reduce((s, t) => s + t.amount, 0)
  const pendingRevenue = transactions.filter((t) => t.status === 'pending').reduce((s, t) => s + t.amount, 0)
  const completedRevenue = transactions.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance & Revenue</h1>
          <p className="text-sm text-muted">Financial overview, transactions, and reconciliation</p>
        </div>
        <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} trend={12} description="vs last month" variant="default" />
        <StatCard title="Insurance Claims" value={formatCurrency(insuranceClaims)} icon={ShieldCheck} trend={8} description="vs last month" variant="default" />
        <StatCard title="Pending Payments" value={formatCurrency(pendingRevenue)} icon={Clock} trend={-3} description="vs last month" variant="warning" />
        <StatCard title="Completed Payments" value={formatCurrency(completedRevenue)} icon={CheckCircle2} trend={15} description="vs last month" variant="success" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-secondary" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4 text-secondary" />
              Mobile Money Reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mobileMoneyReconciliation.map((mm) => (
              <div key={mm.provider} className="rounded-2xl border border-border p-4">
                <p className="mb-2 font-medium text-foreground">{mm.provider}</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Total Transactions</span>
                    <span className="font-medium text-foreground">{mm.transactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Settled</span>
                    <span className="font-medium text-success">{mm.settled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Pending</span>
                    <span className="font-medium text-warning">{mm.pending}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1">
                    <span className="text-muted">Amount</span>
                    <span className="font-bold text-foreground">{formatCurrency(mm.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-success/5 p-3 text-center text-xs text-success">
              All mobile money providers reconciled as of today
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['All Transactions', 'Insurance', 'Mobile Money'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Reference</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Patient</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Description</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Method</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="border-b border-border transition-colors hover:bg-secondary/5">
                      <td className="px-4 py-3 text-foreground">{tx.date}</td>
                      <td className="px-4 py-3 text-xs text-muted">{tx.reference}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{tx.patient}</td>
                      <td className="px-4 py-3 text-muted">{tx.description}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(tx.amount)}</td>
                      <td className="px-4 py-3 text-muted capitalize">{tx.method.replace('_', ' ')}</td>
                      <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted">No transactions found.</div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
