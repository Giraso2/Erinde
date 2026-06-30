import { Outlet } from 'react-router-dom'
import { DashboardLayout } from './dashboard-layout'

export function ReceptionistLayout() {
  return (
    <DashboardLayout role="receptionist">
      <Outlet />
    </DashboardLayout>
  )
}
