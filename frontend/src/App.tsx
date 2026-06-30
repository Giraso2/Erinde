import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { PatientLayout } from '@/layouts/patient-layout'
import { DoctorLayout } from '@/layouts/doctor-layout'
import { AdminLayout } from '@/layouts/admin-layout'
import { MinistryLayout } from '@/layouts/ministry-layout'
import PatientHome from '@/pages/patient/home'
import PatientAppointments from '@/pages/patient/appointments'
import PatientQueue from '@/pages/patient/queue'
import PatientPayments from '@/pages/patient/payments'
import PatientMedicalHistory from '@/pages/patient/medical-history'
import PatientNotifications from '@/pages/patient/notifications'
import DoctorHome from '@/pages/doctor/home'
import DoctorAppointments from '@/pages/doctor/appointments'
import DoctorPatientDetails from '@/pages/doctor/patient-details'
import DoctorConsultation from '@/pages/doctor/consultation'
import DoctorQueueManagement from '@/pages/doctor/queue-management'
import DoctorCalendar from '@/pages/doctor/calendar'
import AdminDashboard from '@/pages/admin/dashboard'
import AdminQueueManagement from '@/pages/admin/queue-management'
import AdminStaff from '@/pages/admin/staff'
import AdminAppointments from '@/pages/admin/appointments'
import AdminFinance from '@/pages/admin/finance'
import AdminInventory from '@/pages/admin/inventory'
import AdminReports from '@/pages/admin/reports'
import MinistryDashboard from '@/pages/ministry/dashboard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Patient Routes */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientHome />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="queue" element={<PatientQueue />} />
            <Route path="payments" element={<PatientPayments />} />
            <Route path="medical-history" element={<PatientMedicalHistory />} />
            <Route path="notifications" element={<PatientNotifications />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorHome />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients/:patientId" element={<DoctorPatientDetails />} />
            <Route path="consultation/:patientId" element={<DoctorConsultation />} />
            <Route path="queue" element={<DoctorQueueManagement />} />
            <Route path="calendar" element={<DoctorCalendar />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="queue" element={<AdminQueueManagement />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Ministry Routes */}
          <Route path="/ministry" element={<MinistryLayout />}>
            <Route index element={<MinistryDashboard />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/patient" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: { borderRadius: '16px', padding: '12px 16px', fontSize: '14px' },
      }} />
    </QueryClientProvider>
  )
}

export default App
