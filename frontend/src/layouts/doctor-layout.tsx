import { Outlet } from 'react-router-dom'
import { DashboardLayout } from './dashboard-layout'

export function DoctorLayout() {
  return (
    <DashboardLayout role="doctor">
      <Outlet />
    </DashboardLayout>
  )
}
