export type UserRole = 'patient' | 'doctor' | 'admin' | 'ministry' | 'receptionist'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  hospitalId?: string
  hospitalName?: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  hospitalId: string
  hospitalName: string
  department: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'waiting' | 'missed'
  type: string
}

export interface QueueEntry {
  id: string
  queueNumber: string
  patientId: string
  patientName: string
  department: string
  hospitalId: string
  hospitalName: string
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'missed'
  position: number
  estimatedWait: number
  joinedAt: string
}

export interface Payment {
  id: string
  patientId: string
  amount: number
  method: 'mobile_money' | 'bank' | 'insurance'
  provider?: 'mtn' | 'airtel'
  status: 'pending' | 'completed' | 'failed'
  reference: string
  date: string
  description: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  type: 'diagnosis' | 'prescription' | 'lab_result' | 'vaccination'
  title: string
  doctorName: string
  date: string
  notes: string
  attachments?: string[]
}

export interface Hospital {
  id: string
  name: string
  district: string
  capacity: number
  currentPatients: number
  departments: string[]
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  hospitalId: string
  hospitalName: string
  available: boolean
  nextAvailableTime?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'appointment' | 'queue' | 'payment' | 'medicine' | 'announcement'
  read: boolean
  createdAt: string
}

export interface Staff {
  id: string
  name: string
  role: 'doctor' | 'nurse' | 'receptionist' | 'lab' | 'pharmacist'
  department: string
  status: 'on_duty' | 'off_duty' | 'on_leave'
  schedule: string
}

export interface InventoryItem {
  id: string
  name: string
  category: 'medicine' | 'equipment' | 'supplies'
  quantity: number
  unit: string
  threshold: number
  expiryDate?: string
  supplier?: string
}

export interface Department {
  id: string
  name: string
  queueLength: number
  avgWaitTime: number
  doctorsOnDuty: number
  status: 'normal' | 'busy' | 'overloaded'
}
