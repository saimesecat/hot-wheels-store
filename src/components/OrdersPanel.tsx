// src/components/OrdersPanel.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'

type Order = { id: string; buyerName: string; status: string }

export function OrdersPanel() {
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [filter, setFilter]     = useState<'all'|'pending'|'confirmed'|'shipped'>('all')

  useEffect(() => {
    setLoading(true)
    setError(null)

    const endpoint =
      filter === 'all'
        ? '/api/orders'
        : `/api/orders?status=${filter}`

    axios.get<Order[]>(endpoint)
      .then((res) => setOrders(res.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [filter])

  if (loading) return <p>Loading orders…</p>
  if (error)   return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <div className="mb-4">
        <label>
          Show:&nbsp;
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded p-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
          </select>
        </label>
      </div>

      <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded shadow">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2">Buyer</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="p-2">{o.buyerName}</td>
              <td className="p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}