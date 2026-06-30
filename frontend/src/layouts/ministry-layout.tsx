import { Outlet } from 'react-router-dom'
import { DashboardLayout } from './dashboard-layout'

export function MinistryLayout() {
  return (
    <DashboardLayout role="ministry">
      <Outlet />
    </DashboardLayout>
  )
}
