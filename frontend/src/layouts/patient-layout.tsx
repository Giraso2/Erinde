import { Outlet } from 'react-router-dom'
import { DashboardLayout } from './dashboard-layout'

export function PatientLayout() {
  return (
    <DashboardLayout role="patient">
      <Outlet />
    </DashboardLayout>
  )
}
