import { Outlet } from 'react-router-dom'
import { DashboardLayout } from './dashboard-layout'

export function AdminLayout() {
  return (
    <DashboardLayout role="admin">
      <Outlet />
    </DashboardLayout>
  )
}
