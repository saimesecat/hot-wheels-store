// src/pages/admin/index.tsx

import { useState, useEffect } from 'react'
import AdminAppShell from '@/components/AdminAppShell'
import { View } from '@/components/AdminLayout'
import { SummaryCard } from '@/components/SummaryCard'
import { OrdersPanel } from '@/components/OrdersPanel'

type Counts = {
  products: number
  sellers: number
  pendingOrders: number
  logs: number
}

export default function AdminPage() {
  const [view, setView] = useState<View>('dashboard')
  const [counts, setCounts] = useState<Counts>({
    products: 0,
    sellers: 0,
    pendingOrders: 0,
    logs: 0,
  })
  const [loadingCounts, setLoadingCounts] = useState(true)

  useEffect(() => {
    async function loadCounts() {
      setLoadingCounts(true)
      try {
        const [p, s, po, l] = await Promise.all([
          fetch('/api/products').then((r) => r.json()),
          fetch('/api/sellers').then((r) => r.json()),
          fetch('/api/orders?status=pending').then((r) => r.json()),
          fetch('/api/activity-logs').then((r) => r.json()),
        ])
        setCounts({
          products: Array.isArray(p) ? p.length : 0,
          sellers: Array.isArray(s) ? s.length : 0,
          pendingOrders: Array.isArray(po) ? po.length : 0,
          logs: Array.isArray(l) ? l.length : 0,
        })
      } catch (err) {
        console.error('Error loading dashboard counts', err)
      } finally {
        setLoadingCounts(false)
      }
    }
    loadCounts()
  }, [])

  return (
    <AdminAppShell view={view} setView={setView}>
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {loadingCounts ? (
            <p className="col-span-4 text-center">Loading stats…</p>
          ) : (
            <>
              <SummaryCard title="Total Products" fetchUrl="/api/products" />
              <SummaryCard title="Total Sellers" fetchUrl="/api/sellers" />
              <SummaryCard title="Pending Orders" fetchUrl="/api/orders?status=pending" />
              <SummaryCard title="Activity Logs" fetchUrl="/api/activity-logs" />
            </>
          )}
        </div>
      )}

      {view === 'orders' && (
        <div className="p-4">
          <OrdersPanel />
        </div>
      )}

      {view === 'products' && (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          Products panel coming soon
        </div>
      )}

      {view === 'sellers' && (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          Sellers panel coming soon
        </div>
      )}

      {view === 'logs' && (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          Activity log panel coming soon
        </div>
      )}
    </AdminAppShell>
  )
}