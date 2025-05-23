// ─────────────────────────────────────────────────────────────────────────────
// File: src/components/ProductsPanel.tsx

import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

export function ProductsPanel() {
  const { data: products, error } = useSWR('/api/products', fetcher)

  if (error) return <div className="p-4 text-red-600">Failed to load products</div>
  if (!products) return <div className="p-4">Loading products…</div>

  return (
    <div className="bg-white rounded shadow overflow-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Price (INR)</th>
            <th className="p-2 border">Qty</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.brand}</td>
              <td className="p-2 border">{p.priceINR}</td>
              <td className="p-2 border">{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}