import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ShieldCheck,
  Building2,
  BadgeCheck,
  Percent,
  Calendar,
  Printer,
  FileCheck,
  UserCheck,
  History,
  FileText,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { EmptyState } from '@/components/empty-state'

const insuranceProviders: Record<string, { name: string; color: string }> = {
  cbhi: { name: 'CBHI', color: 'text-success' },
  rssb: { name: 'RSSB', color: 'text-secondary' },
  private: { name: 'Private', color: 'text-warning' },
}

const mockInsuranceData = {
  patientName: 'Alice Uwimana',
  patientId: 'P-2024-0042',
  provider: 'cbhi' as const,
  providerName: 'Community Based Health Insurance (CBHI)',
  membershipStatus: 'Active' as const,
  coverage: 85,
  expiryDate: 'December 31, 2026',
  memberSince: 'January 15, 2022',
  dependents: 4,
}

const verificationHistory = [
  { date: 'Jun 30, 2026', verifiedBy: 'Samuel Nkusi', method: 'Online', status: 'Verified' as const },
  { date: 'Jun 15, 2026', verifiedBy: 'Chantal Nyiraneza', method: 'Manual', status: 'Verified' as const },
  { date: 'May 28, 2026', verifiedBy: 'Samuel Nkusi', method: 'Online', status: 'Verified' as const },
  { date: 'May 10, 2026', verifiedBy: 'System', method: 'Auto', status: 'Failed' as const },
]

export default function InsuranceVerification() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [found, setFound] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearched(true)
    setTimeout(() => {
      setSearching(false)
      setFound(true)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-primary">Insurance Verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verify patient insurance coverage and print verification documents.
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
                {searching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
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
            icon={ShieldCheck}
            title="Patient Not Found"
            description="No patient matches your search. Try a different Patient ID or Name."
            action={{ label: 'Try Again', onClick: () => {} }}
          />
        )}

        {searched && !searching && found && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Insurance Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent p-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                      <ShieldCheck className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">{mockInsuranceData.providerName}</span>
                        <Badge variant="success" className="uppercase">
                          {mockInsuranceData.membershipStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {mockInsuranceData.patientName} &middot; {mockInsuranceData.patientId}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3 rounded-2xl bg-surface p-4">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">Coverage</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Percentage</span>
                          <span className="text-sm font-bold text-foreground">{mockInsuranceData.coverage}%</span>
                        </div>
                        <Progress value={mockInsuranceData.coverage} variant="success" />
                      </div>
                    </div>
                    <div className="space-y-3 rounded-2xl bg-surface p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">Expiry Date</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mockInsuranceData.expiryDate}</p>
                    </div>
                    <div className="space-y-3 rounded-2xl bg-surface p-4">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">Member Since</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mockInsuranceData.memberSince}</p>
                    </div>
                    <div className="space-y-3 rounded-2xl bg-surface p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">Dependents</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mockInsuranceData.dependents} covered members</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Verify Coverage
                    </Button>
                    <Button variant="primary" size="lg" className="gap-2">
                      <Printer className="h-5 w-5" />
                      Print Verification
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                      <FileCheck className="h-5 w-5" />
                      Request Manual Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <Badge variant="secondary">{insuranceProviders[mockInsuranceData.provider]?.name}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="success">{mockInsuranceData.membershipStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <span className="text-sm text-muted-foreground">Coverage</span>
                    <span className="text-sm font-medium text-foreground">{mockInsuranceData.coverage}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <span className="text-sm text-muted-foreground">Dependents</span>
                    <span className="text-sm font-medium text-foreground">{mockInsuranceData.dependents}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Verified By</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationHistory.map((entry, index) => (
                        <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/5">
                          <td className="px-6 py-4 text-sm text-foreground">{entry.date}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.verifiedBy}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.method}</td>
                          <td className="px-6 py-4">
                            <Badge variant={entry.status === 'Verified' ? 'success' : 'error'}>
                              {entry.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!searched && (
          <EmptyState
            icon={ShieldCheck}
            title="Search for Insurance Details"
            description="Enter a Patient ID or Name to view and verify their insurance coverage."
          />
        )}
      </motion.div>
    </motion.div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
