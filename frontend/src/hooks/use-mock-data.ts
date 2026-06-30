import type {
  Appointment,
  QueueEntry,
  Payment,
  MedicalRecord,
  Notification,
  Doctor,
  Hospital,
  Staff,
  InventoryItem,
  Department,
} from '@/types'

const hospitals = [
  { id: 'h1', name: 'CHUK', district: 'Kigali' },
  { id: 'h2', name: 'Kanombe Military Hospital', district: 'Kicukiro' },
  { id: 'h3', name: 'Kigali University Teaching Hospital', district: 'Nyarugenge' },
  { id: 'h4', name: 'Butare University Teaching Hospital', district: 'Huye' },
  { id: 'h5', name: 'Rwamagana Provincial Hospital', district: 'Rwamagana' },
  { id: 'h6', name: 'Musanze District Hospital', district: 'Musanze' },
]

const departments: string[] = [
  'General Consultation',
  'Pediatrics',
  'Emergency',
  'Maternity',
  'Pharmacy',
  'Dermatology',
  'Cardiology',
  'Laboratory',
]

const patientNames = [
  'Alice Uwimana', 'Jean Marie Vianney', 'Frida Mukamana', 'Eric Mugisha',
  'Marie Claire Uwase', 'Patrick Habimana', 'Diane Umubyeyi', 'Jean Pierre Niyonzima',
  'Grace Uwimana', 'Olivier Niyomugabo', 'Chantal Nyiraneza', 'David Hakizimana',
  'Esther Mukeshimana', 'Emmanuel Ndayisaba', 'Joseph Mugabo',
]

const doctorNames = [
  'Dr. Jean Damascene', 'Dr. Alice Benishyaka', 'Dr. Eric Niyonzima',
  'Dr. Marie Goretti', 'Dr. John Mugabo', 'Dr. Olive Uwamahoro',
  'Dr. Samuel Nkusi', 'Dr. Beatrice Mukantabana',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMany<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function inHours(h: number): string {
  const d = new Date()
  d.setHours(d.getHours() + h)
  return d.toISOString()
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function usePatientData() {
  const appointments: Appointment[] = [
    {
      id: 'apt-1', patientId: 'p1', patientName: 'Alice Uwimana',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '09:00',
      status: 'confirmed', type: 'checkup',
    },
    {
      id: 'apt-2', patientId: 'p1', patientName: 'Alice Uwimana',
      doctorId: 'd2', doctorName: 'Dr. Alice Benishyaka', hospitalId: 'h3',
      hospitalName: 'Kigali University Teaching Hospital', department: 'General Consultation',
      date: daysAgo(2).slice(0, 10), time: '14:30',
      status: 'completed', type: 'follow-up',
    },
    {
      id: 'apt-3', patientId: 'p1', patientName: 'Alice Uwimana',
      doctorId: 'd3', doctorName: 'Dr. Eric Niyonzima', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Pediatrics',
      date: daysAgo(-5).slice(0, 10), time: '11:00',
      status: 'pending', type: 'consultation',
    },
  ]

  const queue: QueueEntry[] = [
    {
      id: 'q-1', queueNumber: 'A045', patientId: 'p1', patientName: 'Alice Uwimana',
      department: 'Cardiology', hospitalId: 'h1', hospitalName: 'CHUK',
      status: 'waiting', position: 3, estimatedWait: 25, joinedAt: inHours(-1),
    },
  ]

  const payments: Payment[] = [
    {
      id: 'pay-1', patientId: 'p1', amount: 15000, method: 'mobile_money',
      provider: 'mtn', status: 'completed', reference: 'REF-2024-001',
      date: daysAgo(1), description: 'Consultation fee - Cardiology',
    },
    {
      id: 'pay-2', patientId: 'p1', amount: 8500, method: 'mobile_money',
      provider: 'airtel', status: 'completed', reference: 'REF-2024-002',
      date: daysAgo(3), description: 'Lab test - Blood work',
    },
    {
      id: 'pay-3', patientId: 'p1', amount: 25000, method: 'insurance',
      status: 'pending', reference: 'REF-2024-003',
      date: daysAgo(0), description: 'Pharmacy - Prescription refill',
    },
  ]

  const medicalRecords: MedicalRecord[] = [
    {
      id: 'rec-1', patientId: 'p1', type: 'diagnosis',
      title: 'Hypertension Diagnosis', doctorName: 'Dr. Jean Damascene',
      date: daysAgo(30), notes: 'Patient diagnosed with Stage 1 hypertension. Prescribed Enalapril 10mg daily. Follow-up in 2 weeks.',
    },
    {
      id: 'rec-2', patientId: 'p1', type: 'prescription',
      title: 'Enalapril 10mg', doctorName: 'Dr. Jean Damascene',
      date: daysAgo(30), notes: 'Take one tablet daily. Refill in 30 days.',
    },
    {
      id: 'rec-3', patientId: 'p1', type: 'lab_result',
      title: 'Complete Blood Count', doctorName: 'Dr. Marie Goretti',
      date: daysAgo(7), notes: 'Results within normal range. Hemoglobin: 13.5 g/dL, WBC: 6,200/mL.',
    },
    {
      id: 'rec-4', patientId: 'p1', type: 'vaccination',
      title: 'COVID-19 Booster', doctorName: 'Dr. Samuel Nkusi',
      date: daysAgo(90), notes: 'Moderna booster administered. No adverse reactions.',
    },
  ]

  const notifications: Notification[] = [
    {
      id: 'notif-1', userId: 'p1', title: 'Appointment Reminder',
      message: 'You have a Cardiology appointment at CHUK tomorrow at 09:00.',
      type: 'appointment', read: false, createdAt: daysAgo(0),
    },
    {
      id: 'notif-2', userId: 'p1', title: 'Queue Update',
      message: 'Your position in Cardiology queue: #3. Estimated wait: 25 min.',
      type: 'queue', read: false, createdAt: inHours(-1),
    },
    {
      id: 'notif-3', userId: 'p1', title: 'Payment Confirmed',
      message: 'Your payment of 15,000 RWF via MTN Mobile Money has been confirmed.',
      type: 'payment', read: true, createdAt: daysAgo(1),
    },
    {
      id: 'notif-4', userId: 'p1', title: 'Prescription Ready',
      message: 'Your prescription from Cardiology is ready for pickup at the Pharmacy.',
      type: 'medicine', read: false, createdAt: daysAgo(0),
    },
  ]

  return {
    appointments,
    queue,
    payments,
    medicalRecords,
    notifications,
  }
}

export function useDoctorData() {
  const todayAppointments: Appointment[] = [
    {
      id: 'd-apt-1', patientId: 'p2', patientName: 'Jean Marie Vianney',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '08:30',
      status: 'checked_in', type: 'follow-up',
    },
    {
      id: 'd-apt-2', patientId: 'p3', patientName: 'Frida Mukamana',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '09:00',
      status: 'waiting', type: 'consultation',
    },
    {
      id: 'd-apt-3', patientId: 'p4', patientName: 'Eric Mugisha',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '10:00',
      status: 'confirmed', type: 'checkup',
    },
    {
      id: 'd-apt-4', patientId: 'p5', patientName: 'Marie Claire Uwase',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '11:00',
      status: 'confirmed', type: 'procedure',
    },
    {
      id: 'd-apt-5', patientId: 'p6', patientName: 'Patrick Habimana',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '14:00',
      status: 'confirmed', type: 'follow-up',
    },
    {
      id: 'd-apt-6', patientId: 'p7', patientName: 'Diane Umubyeyi',
      doctorId: 'd1', doctorName: 'Dr. Jean Damascene', hospitalId: 'h1',
      hospitalName: 'CHUK', department: 'Cardiology',
      date: daysAgo(0).slice(0, 10), time: '15:30',
      status: 'completed', type: 'consultation',
    },
  ]

  const patients = todayAppointments.map((a) => ({
    id: a.patientId,
    name: a.patientName,
    lastVisit: daysAgo(Math.floor(Math.random() * 60)),
    condition: pick(['Hypertension', 'Arrhythmia', 'Heart murmur', 'Chest pain', 'Post-surgery follow-up']),
  }))

  const schedule = [
    { day: 'Monday', start: '08:00', end: '17:00' },
    { day: 'Tuesday', start: '08:00', end: '17:00' },
    { day: 'Wednesday', start: '08:00', end: '12:00' },
    { day: 'Thursday', start: '08:00', end: '17:00' },
    { day: 'Friday', start: '08:00', end: '16:00' },
  ]

  return {
    appointments: todayAppointments,
    patients,
    schedule,
  }
}

export function useAdminData() {
  const dashboardStats = {
    totalPatients: 1274,
    patientsToday: 48,
    totalAppointments: 342,
    appointmentsToday: 26,
    occupancyRate: 73,
    activeStaff: 86,
    revenueToday: 1845000,
    revenueMonth: 42750000,
    avgWaitTime: 18,
  }

  const staff: Staff[] = [
    { id: 'st-1', name: 'Dr. Jean Damascene', role: 'doctor', department: 'Cardiology', status: 'on_duty', schedule: '08:00 - 17:00' },
    { id: 'st-2', name: 'Dr. Alice Benishyaka', role: 'doctor', department: 'Pediatrics', status: 'on_duty', schedule: '08:00 - 17:00' },
    { id: 'st-3', name: 'Dr. Eric Niyonzima', role: 'doctor', department: 'Emergency', status: 'on_duty', schedule: '14:00 - 22:00' },
    { id: 'st-4', name: 'Nurse Marie Goretti', role: 'nurse', department: 'Maternity', status: 'on_duty', schedule: '08:00 - 17:00' },
    { id: 'st-5', name: 'Nurse John Mugabo', role: 'nurse', department: 'Emergency', status: 'on_duty', schedule: '22:00 - 06:00' },
    { id: 'st-6', name: 'Nurse Olive Uwamahoro', role: 'nurse', department: 'Pediatrics', status: 'off_duty', schedule: '08:00 - 17:00' },
    { id: 'st-7', name: 'Samuel Nkusi', role: 'receptionist', department: 'General Consultation', status: 'on_duty', schedule: '08:00 - 17:00' },
    { id: 'st-8', name: 'Beatrice Mukantabana', role: 'lab', department: 'Laboratory', status: 'on_duty', schedule: '08:00 - 17:00' },
    { id: 'st-9', name: 'David Hakizimana', role: 'pharmacist', department: 'Pharmacy', status: 'on_leave', schedule: '08:00 - 17:00' },
    { id: 'st-10', name: 'Grace Uwimana', role: 'nurse', department: 'Maternity', status: 'on_duty', schedule: '08:00 - 17:00' },
    { id: 'st-11', name: 'Emmanuel Ndayisaba', role: 'doctor', department: 'General Consultation', status: 'off_duty', schedule: '08:00 - 17:00' },
    { id: 'st-12', name: 'Chantal Nyiraneza', role: 'receptionist', department: 'Emergency', status: 'on_duty', schedule: '14:00 - 22:00' },
  ]

  const inventory: InventoryItem[] = [
    { id: 'inv-1', name: 'Paracetamol 500mg', category: 'medicine', quantity: 5000, unit: 'tabs', threshold: 1000, expiryDate: daysAgo(-180).slice(0, 10), supplier: 'Rwandapharma' },
    { id: 'inv-2', name: 'Amoxicillin 250mg', category: 'medicine', quantity: 3000, unit: 'capsules', threshold: 800, expiryDate: daysAgo(-240).slice(0, 10), supplier: 'Rwandapharma' },
    { id: 'inv-3', name: 'Enalapril 10mg', category: 'medicine', quantity: 1500, unit: 'tabs', threshold: 500, expiryDate: daysAgo(-365).slice(0, 10), supplier: 'MediRwanda' },
    { id: 'inv-4', name: 'Surgical Gloves', category: 'supplies', quantity: 200, unit: 'boxes', threshold: 50, supplier: 'MedEquip Ltd' },
    { id: 'inv-5', name: 'Syringes 5ml', category: 'supplies', quantity: 3500, unit: 'pieces', threshold: 1000, supplier: 'MedEquip Ltd' },
    { id: 'inv-6', name: 'Stethoscopes', category: 'equipment', quantity: 25, unit: 'units', threshold: 10, supplier: 'Surgical Supplies Co' },
    { id: 'inv-7', name: 'Blood Pressure Monitors', category: 'equipment', quantity: 15, unit: 'units', threshold: 5, supplier: 'Surgical Supplies Co' },
    { id: 'inv-8', name: 'ORS Sachets', category: 'medicine', quantity: 2000, unit: 'sachets', threshold: 500, expiryDate: daysAgo(-90).slice(0, 10), supplier: 'Rwandapharma' },
    { id: 'inv-9', name: 'Cotton Wool Rolls', category: 'supplies', quantity: 300, unit: 'rolls', threshold: 100, supplier: 'MediRwanda' },
    { id: 'inv-10', name: 'Insulin Glargine', category: 'medicine', quantity: 200, unit: 'vials', threshold: 50, expiryDate: daysAgo(-60).slice(0, 10), supplier: 'Global Pharma' },
  ]

  const departmentsList: Department[] = departments.map((name, i) => ({
    id: `dept-${i + 1}`,
    name,
    queueLength: Math.floor(Math.random() * 15) + 2,
    avgWaitTime: Math.floor(Math.random() * 20) + 5,
    doctorsOnDuty: Math.floor(Math.random() * 4) + 1,
    status: (['normal', 'busy', 'overloaded'] as const)[Math.floor(Math.random() * 3)],
  }))

  return {
    stats: dashboardStats,
    staff,
    inventory,
    departments: departmentsList,
  }
}

export function useMinistryData() {
  const nationalStats = {
    totalHospitals: 48,
    totalBeds: 6240,
    occupiedBeds: 4738,
    totalPatients: 142890,
    patientsToday: 1847,
    avgWaitTimeNational: 22,
    bedOccupancyRate: 76,
    doctorsNationwide: 1842,
    nursesNationwide: 9200,
  }

  const alerts = [
    {
      id: 'alert-1',
      title: 'Malaria Outbreak - Eastern Province',
      severity: 'high' as const,
      message: 'Confirmed 147 cases in Rwamagana district over the past week. Immediate vector control measures recommended.',
      date: daysAgo(0),
      region: 'Eastern Province',
    },
    {
      id: 'alert-2',
      title: 'CHUK Emergency Department Overloaded',
      severity: 'medium' as const,
      message: 'CHUK Emergency operating at 140% capacity. Diversion protocol being considered.',
      date: daysAgo(0),
      region: 'Kigali',
    },
    {
      id: 'alert-3',
      title: 'Measles Vaccination Campaign',
      severity: 'low' as const,
      message: 'Nationwide measles vaccination campaign commencing next week. Districts reporting 89% coverage target.',
      date: daysAgo(-1),
      region: 'National',
    },
    {
      id: 'alert-4',
      title: 'Dengue Fever - Rising Cases',
      severity: 'medium' as const,
      message: 'Dengue cases up 35% in Kigali compared to last month. Enhanced surveillance activated.',
      date: daysAgo(-2),
      region: 'Kigali',
    },
  ]

  const diseaseData = [
    { disease: 'Malaria', casesThisMonth: 4820, casesLastMonth: 5410, deaths: 12, trend: 'down' as const },
    { disease: 'Respiratory Infections', casesThisMonth: 3650, casesLastMonth: 3420, deaths: 8, trend: 'up' as const },
    { disease: 'Hypertension', casesThisMonth: 2840, casesLastMonth: 2760, deaths: 23, trend: 'up' as const },
    { disease: 'Diabetes', casesThisMonth: 1950, casesLastMonth: 1880, deaths: 15, trend: 'up' as const },
    { disease: 'Diarrheal Diseases', casesThisMonth: 3120, casesLastMonth: 3580, deaths: 5, trend: 'down' as const },
    { disease: 'HIV/AIDS', casesThisMonth: 890, casesLastMonth: 920, deaths: 34, trend: 'down' as const },
    { disease: 'Tuberculosis', casesThisMonth: 560, casesLastMonth: 590, deaths: 18, trend: 'down' as const },
    { disease: 'Dengue Fever', casesThisMonth: 720, casesLastMonth: 530, deaths: 2, trend: 'up' as const },
  ]

  const hospitalCongestion = hospitals.map((h) => ({
    hospitalId: h.id,
    hospitalName: h.name,
    district: h.district,
    capacity: Math.floor(Math.random() * 200) + 100,
    currentPatients: Math.floor(Math.random() * 150) + 50,
    occupancyRate: Math.floor(Math.random() * 40) + 55,
    waitingCount: Math.floor(Math.random() * 30) + 5,
    avgWaitTimeMinutes: Math.floor(Math.random() * 30) + 10,
    ambulanceCount: Math.floor(Math.random() * 4) + 1,
  }))

  return {
    nationalStats,
    alerts,
    diseaseData,
    hospitalCongestion,
  }
}
