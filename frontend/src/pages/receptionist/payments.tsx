import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  CreditCard,
  Banknote,
  Printer,
  QrCode,
  Smartphone,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  FileText,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'

const mockOutstandingBills = [
  { id: 'bill-1', description: 'Consultation Fee - Cardiology', amount: 15000, date: 'Jun 30, 2026', status: 'Pending' as const },
  { id: 'bill-2', description: 'Lab Test - Complete Blood Count', amount: 8500, date: 'Jun 28, 2026', status: 'Pending' as const },
  { id: 'bill-3', description: 'Pharmacy - Prescription Refill', amount: 25000, date: 'Jun 25, 2026', status: 'Completed' as const },
  { id: 'bill-4', description: 'X-Ray - Chest', amount: 12000, date: 'Jun 22, 2026', status: 'Completed' as const },
  { id: 'bill-5', description: 'Emergency Service Fee', amount: 35000, date: 'Jun 15, 2026', status: 'Completed' as const },
]

const paymentHistory = [
  { id: 'pay-1', date: 'Jun 28, 2026', amount: 8500, method: 'Mobile Money (MTN)', reference: 'MM-2024-8842', status: 'completed' as const },
  { id: 'pay-2', date: 'Jun 25, 2026', amount: 25000, method: 'Insurance (CBHI)', reference: 'INS-2024-4421', status: 'completed' as const },
  { id: 'pay-3', date: 'Jun 22, 2026', amount: 12000, method: 'Cash', reference: 'CSH-2024-3310', status: 'completed' as const },
  { id: 'pay-4', date: 'Jun 15, 2026', amount: 35000, method: 'Mobile Money (Airtel)', reference: 'MM-2024-7712', status: 'completed' as const },
]

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [found, setFound] = useState(false)
  const [paymentTab, setPaymentTab] = useState('all')
  const [mobileRef, setMobileRef] = useState('')
  const [processingMobile, setProcessingMobile] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearched(true)
    setTimeout(() => {
      setSearching(false)
      setFound(true)
    }, 1000)
  }

  const handleMobilePayment = () => {
    if (!mobileRef.trim()) return
    setProcessingMobile(true)
    setTimeout(() => setProcessingMobile(false), 1500)
  }

  const filteredBills = paymentTab === 'all'
    ? mockOutstandingBills
    : paymentTab === 'pending'
      ? mockOutstandingBills.filter((b) => b.status === 'Pending')
      : mockOutstandingBills.filter((b) => b.status === 'Completed')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage patient payments, mobile money confirmations, and receipts.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Search Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter Patient ID or Name..."
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
                {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                Search
              </Button>
            </div>
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
            icon={CreditCard}
            title="Patient Not Found"
            description="No patient found. Please check the Patient ID or Name and try again."
          />
        )}

        {searched && !searching && found && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Outstanding Bills</CardTitle>
                  <Badge variant="error" className="text-sm">
                    {mockOutstandingBills.filter((b) => b.status === 'Pending').reduce((s, b) => s + b.amount, 0).toLocaleString()} RWF Due
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentTab} onValueChange={setPaymentTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsContent value={paymentTab}>
                      <div className="space-y-3">
                        {filteredBills.map((bill) => (
                          <div
                            key={bill.id}
                            className="flex items-center justify-between rounded-2xl border border-border p-4"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">{bill.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{bill.date}</span>
                                <Badge variant={bill.status === 'Pending' ? 'warning' : 'success'} className="text-[10px] px-2 py-0">
                                  {bill.status}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                              {bill.amount.toLocaleString()} RWF
                            </span>
                          </div>
                        ))}
                        {filteredBills.length === 0 && (
                          <p className="py-8 text-center text-sm text-muted-foreground">No bills found.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Method</th>
                          <th className="px-6 py-4">Reference</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((pay) => (
                          <tr key={pay.id} className="border-b border-border last:border-0 hover:bg-secondary/5">
                            <td className="px-6 py-4 text-sm text-foreground">{pay.date}</td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {pay.amount.toLocaleString()} RWF
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{pay.method}</td>
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{pay.reference}</td>
                            <td className="px-6 py-4">
                              <Badge variant="success" className="text-[10px]">Completed</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Money</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl bg-secondary/5 p-3">
                    <Smartphone className="h-5 w-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Confirm MTN / Airtel Money payment</span>
                  </div>
                  <Input
                    placeholder="Enter mobile money reference code"
                    value={mobileRef}
                    onChange={(e) => setMobileRef(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    className="w-full gap-2"
                    disabled={!mobileRef.trim() || processingMobile}
                    onClick={handleMobilePayment}
                  >
                    {processingMobile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {processingMobile ? 'Confirming...' : 'Confirm Payment'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    <QrCode className="h-5 w-5" />
                    Generate Payment QR Code
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full gap-2">
                    <Banknote className="h-5 w-5" />
                    Record Cash Payment
                  </Button>
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <Printer className="h-5 w-5" />
                    Print Receipt
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {!searched && (
          <EmptyState
            icon={CreditCard}
            title="Search for a Patient"
            description="Search for a patient to view their bills, process payments, and print receipts."
          />
        )}
      </motion.div>
    </motion.div>
  )
}
