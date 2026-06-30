import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MapPin, AlertTriangle, TrendingUp, Activity, BedDouble, DollarSign, Users, Building2, Thermometer, Syringe, Stethoscope, FlaskRound, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/stat-card'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ExportButton } from '@/components/export-button'

const congestionData = [
  { name: 'Kigali', patients: 2847, beds: 76, status: 'high' },
  { name: 'South', patients: 1856, beds: 62, status: 'medium' },
  { name: 'North', patients: 1245, beds: 45, status: 'low' },
  { name: 'West', patients: 1567, beds: 55, status: 'medium' },
  { name: 'East', patients: 1345, beds: 48, status: 'low' },
]

const districtFlow = [
  { district: 'Nyarugenge', patients: 892, change: 12 },
  { district: 'Gasabo', patients: 1245, change: -5 },
  { district: 'Kicukiro', patients: 710, change: 8 },
  { district: 'Huye', patients: 567, change: -3 },
  { district: 'Musanze', patients: 678, change: 15 },
  { district: 'Rubavu', patients: 534, change: -2 },
  { district: 'Rwamagana', patients: 445, change: 7 },
  { district: 'Muhanga', patients: 389, change: -8 },
]

const diseaseOutbreaks = [
  { disease: 'Malaria', cases: 1245, trend: 'up', change: 12, severity: 'high' },
  { disease: 'Respiratory', cases: 876, trend: 'down', change: -5, severity: 'medium' },
  { disease: 'Cholera', cases: 23, trend: 'up', change: 8, severity: 'critical' },
  { disease: 'Maternal', cases: 156, trend: 'stable', change: 0, severity: 'low' },
  { disease: 'Measles', cases: 45, trend: 'down', change: -15, severity: 'medium' },
  { disease: 'TB', cases: 234, trend: 'down', change: -3, severity: 'medium' },
]

const revenueTrend = [
  { month: 'Jan', revenue: 42000000, insurance: 18000000, mobile: 15000000 },
  { month: 'Feb', revenue: 45000000, insurance: 19000000, mobile: 16000000 },
  { month: 'Mar', revenue: 48000000, insurance: 20000000, mobile: 18000000 },
  { month: 'Apr', revenue: 46000000, insurance: 18500000, mobile: 17500000 },
  { month: 'May', revenue: 51000000, insurance: 21000000, mobile: 19500000 },
  { month: 'Jun', revenue: 53000000, insurance: 22000000, mobile: 20000000 },
  { month: 'Jul', revenue: 56000000, insurance: 23000000, mobile: 21500000 },
  { month: 'Aug', revenue: 54000000, insurance: 22500000, mobile: 20500000 },
  { month: 'Sep', revenue: 58000000, insurance: 24000000, mobile: 22500000 },
  { month: 'Oct', revenue: 59000000, insurance: 24500000, mobile: 23000000 },
  { month: 'Nov', revenue: 62000000, insurance: 26000000, mobile: 24000000 },
  { month: 'Dec', revenue: 65000000, insurance: 28000000, mobile: 25000000 },
]

const waitTimeTrend = [
  { month: 'Jan', avgWait: 45 }, { month: 'Feb', avgWait: 42 },
  { month: 'Mar', avgWait: 40 }, { month: 'Apr', avgWait: 38 },
  { month: 'May', avgWait: 35 }, { month: 'Jun', avgWait: 33 },
  { month: 'Jul', avgWait: 30 }, { month: 'Aug', avgWait: 28 },
  { month: 'Sep', avgWait: 26 }, { month: 'Oct', avgWait: 24 },
  { month: 'Nov', avgWait: 23 }, { month: 'Dec', avgWait: 22 },
]

const liveAlerts = [
  { id: 1, type: 'critical', title: 'Cholera Outbreak Alert', message: '3 new cases reported in Rubavu district. Immediate response team dispatched.', time: '5 min ago', region: 'Rubavu' },
  { id: 2, type: 'warning', title: 'Hospital Overcapacity', message: 'CHUK at 94% capacity. Consider diverting non-emergency patients.', time: '18 min ago', region: 'Kigali' },
  { id: 3, type: 'warning', title: 'Medicine Shortage', message: 'Malaria medication stock low in 5 districts. Resupply needed within 48h.', time: '32 min ago', region: 'Multiple' },
  { id: 4, type: 'info', title: 'System Milestone', message: '500,000th patient served on Erinde platform. 🎉', time: '1h ago', region: 'National' },
  { id: 5, type: 'info', title: 'New Hospital Online', message: 'Rwinkwavu Hospital now connected to Erinde system.', time: '2h ago', region: 'Eastern' },
]

const formatCurrency = (val: number) => `RWF ${(val / 1000000).toFixed(1)}M`

function Dashboard() {
  const [alertFilter, setAlertFilter] = useState('all')

  const filterAlerts = alertFilter === 'all' ? liveAlerts : liveAlerts.filter(a => a.type === alertFilter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">National Health Command Center</h1>
          <p className="text-muted-foreground">Real-time national health intelligence and analytics dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
          <Badge className="bg-success/10 text-success border-success/20 px-3 py-1.5 text-sm">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse mr-2" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* National Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Facilities" value="450+" icon={Building2} trend={3} variant="default" />
        <StatCard title="Patients Today" value="12,847" icon={Users} trend={-8} variant="warning" />
        <StatCard title="Avg Wait Time" value="22 min" icon={Clock} trend={-70} variant="success" />
        <StatCard title="Bed Occupancy" value="68%" icon={BedDouble} trend={5} variant="default" />
        <StatCard title="Revenue Today" value="RWF 42.8M" icon={DollarSign} trend={12} variant="success" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* National Map / Congestion */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-secondary" />
              National Hospital Congestion Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {congestionData.map((region, i) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-4 text-center cursor-pointer transition-all hover:scale-105 ${
                    region.status === 'high' ? 'bg-error/10 border border-error/20' :
                    region.status === 'medium' ? 'bg-warning/10 border border-warning/20' :
                    'bg-success/10 border border-success/20'
                  }`}
                >
                  <div className={`text-lg font-bold ${
                    region.status === 'high' ? 'text-error' :
                    region.status === 'medium' ? 'text-warning' : 'text-success'
                  }`}>{region.patients.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{region.name}</div>
                  <div className="mt-2">
                    <Progress
                      value={region.beds}
                      variant={region.status === 'high' ? 'error' : region.status === 'medium' ? 'warning' : 'success'}
                      className="h-1.5"
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{region.beds}% beds filled</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {districtFlow.map((d, i) => (
                <div key={d.district} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/50 transition-colors">
                  <div>
                    <div className="text-sm font-medium">{d.district}</div>
                    <div className="text-xs text-muted-foreground">{d.patients} patients</div>
                  </div>
                  <Badge variant={d.change > 0 ? 'warning' : 'success'} className="text-[10px]">
                    {d.change > 0 ? '↑' : '↓'} {Math.abs(d.change)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              {['all', 'critical', 'warning', 'info'].map(f => (
                <button key={f} onClick={() => setAlertFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    alertFilter === f ? 'bg-primary text-white' : 'bg-accent text-muted-foreground hover:bg-accent/80'
                  }`}
                >{f}</button>
              ))}
            </div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filterAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border ${
                    alert.type === 'critical' ? 'border-error/20 bg-error/5' :
                    alert.type === 'warning' ? 'border-warning/20 bg-warning/5' :
                    'border-border bg-accent/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.type === 'critical' ? 'bg-error animate-pulse' :
                      alert.type === 'warning' ? 'bg-warning' : 'bg-secondary'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{alert.title}</span>
                        <Badge variant={
                          alert.type === 'critical' ? 'error' :
                          alert.type === 'warning' ? 'warning' : 'secondary'
                        } className="text-[10px] ml-2 flex-shrink-0">{alert.region}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{alert.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disease Outbreaks & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Thermometer className="w-5 h-5 text-error" />
              Disease Outbreak Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diseaseOutbreaks.map(d => (
                <div key={d.disease} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      d.severity === 'critical' ? 'bg-error' :
                      d.severity === 'high' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <div>
                      <div className="text-sm font-medium">{d.disease}</div>
                      <div className="text-xs text-muted-foreground">{d.cases} cases</div>
                    </div>
                  </div>
                  <Badge variant={
                    d.trend === 'up' ? 'warning' :
                    d.trend === 'down' ? 'success' : 'secondary'
                  } className="text-[10px]">
                    {d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '→'} {Math.abs(d.change)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Revenue & Insurance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="revenue" name="Total Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="insurance" name="Insurance Claims" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mobile" name="Mobile Money" fill="#0B1F4D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Wait Time & AI Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-secondary" />
              Average Waiting Time Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={waitTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" min" />
                <Tooltip formatter={(v: number) => `${v} min`} />
                <Area type="monotone" dataKey="avgWait" name="Avg Wait Time" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4 p-3 bg-success/5 rounded-xl">
              <Badge variant="success" className="text-sm px-4 py-1.5">↓ 70% reduction since launch</Badge>
              <span className="text-xs text-muted-foreground">Target: 15 min by Q4 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-secondary" />
              AI Predictions & Forecasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/5 to-accent border border-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[10px]">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-1 animate-pulse" />
                    AI FORECAST
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm">Next 7 Days Prediction</h4>
                <p className="text-xs text-muted-foreground mt-1">Patient volume expected to increase by 12% in Kigali region. Consider additional staff allocation at CHUK and Kanombe hospitals.</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="warning" className="text-[10px]">High confidence</Badge>
                  <Badge variant="secondary" className="text-[10px]">Updated 5 min ago</Badge>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-warning/5 to-accent border border-warning/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">
                    <span className="w-1.5 h-1.5 bg-warning rounded-full mr-1" />
                    EARLY WARNING
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm">Seasonal Malaria Surge</h4>
                <p className="text-xs text-muted-foreground mt-1">Rainy season predicted to increase malaria cases by 25-30%. Ensure sufficient medication stock in Southern and Western provinces.</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="warning" className="text-[10px]">Medium confidence</Badge>
                  <Badge variant="secondary" className="text-[10px]">48h response window</Badge>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-success/5 to-accent border border-success/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                    <span className="w-1.5 h-1.5 bg-success rounded-full mr-1" />
                    OPTIMIZATION
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm">Resource Allocation Suggestion</h4>
                <p className="text-xs text-muted-foreground mt-1">Reallocate 3 mobile clinics from Northern province to Eastern province based on current patient flow patterns.</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="success" className="text-[10px]">High impact</Badge>
                  <Badge variant="secondary" className="text-[10px]">Cost savings: RWF 2.3M</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard
