// src/pages/admin/index.tsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Dialog } from '@headlessui/react'
import { AdminLayout, View } from '@/components/AdminLayout'

const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? 'secret-api-key'

export default function AdminPage() {
  const [view, setView] = useState<View>('dashboard')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    products: any[]
    sellers: any[]
    orders: any[]
    logs: any[]
  }>({ products: [], sellers: [], orders: [], logs: [] })
  const [detail, setDetail] = useState<any>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [p, s, o, l] = await Promise.all([
          axios.get('/api/products',      { headers: { 'x-api-key': apiKey } }),
          axios.get('/api/sellers',       { headers: { 'x-api-key': apiKey } }),
          axios.get('/api/orders',        { headers: { 'x-api-key': apiKey } }),
          axios.get('/api/activity-logs', { headers: { 'x-api-key': apiKey } }),
        ])
        setData({
          products: p.data,
          sellers:  s.data,
          orders:   o.data,
          logs:     l.data,
        })
      } catch {
        alert('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const summaries: { key: View; title: string; value: number }[] = [
    { key: 'products', title: 'Products', value: data.products.length },
    { key: 'sellers',  title: 'Sellers',  value: data.sellers.length },
    { key: 'orders',   title: 'Orders',   value: data.orders.length },
    { key: 'logs',     title: 'Activity', value: data.logs.length },
  ]

  return (
    <AdminLayout view={view} setView={setView}>
      {loading ? (
        <p className="text-center mt-20">Loading…</p>
      ) : view === 'dashboard' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaries.map(({ key, title, value }) => (
            <div
              key={key}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start justify-center cursor-pointer hover:scale-[1.02] transition"
              onClick={() => setView(key)}
            >
              <p className="text-sm uppercase text-gray-600 dark:text-gray-400">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold capitalize">{view}</h1>
          <ul className="bg-white dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {data[view].map((item: any) => (
              <li
                key={item.id}
                className="py-3 px-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 rounded cursor-pointer"
                onClick={() => { setDetail(item); setOpen(true) }}
              >
                <span>
                  {item.name ?? item.buyerName ?? item.action}
                </span>
                <button className="text-accent hover:underline text-sm">
                  Details
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-secondary dark:bg-primary p-6 overflow-auto">
          <Dialog.Panel>
            <Dialog.Title className="text-xl font-semibold mb-4">
              Details
            </Dialog.Title>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm whitespace-pre-wrap">
              {JSON.stringify(detail, null, 2)}
            </pre>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </AdminLayout>
  )
}