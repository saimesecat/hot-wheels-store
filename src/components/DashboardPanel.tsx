// src/components/DashboardPanel.tsx
import { SummaryCard } from './SummaryCard'

export function DashboardPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <SummaryCard title="Total Products"   fetchUrl="/api/products" />
      <SummaryCard title="Total Sellers"    fetchUrl="/api/sellers" />
      <SummaryCard title="Pending Orders"   fetchUrl="/api/orders?status=pending" />
      <SummaryCard title="Activity Logs"    fetchUrl="/api/activity-logs" />
    </div>
  )
}