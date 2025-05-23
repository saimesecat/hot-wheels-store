// src/components/SellersPanel.tsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'

type Seller = {
  id: string
  name: string
  whatsapp: string
  isApproved: boolean
}

export function SellersPanel() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Seller[]>('/api/sellers')
      .then((res) => setSellers(res.data))
      .catch(() => setError('Failed to load sellers'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading sellers…</p>
  if (error)   return <p className="text-red-600">{error}</p>

  return (
    <div className="bg-white rounded shadow p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Sellers</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">WhatsApp</th>
            <th className="p-2 text-center">Approved</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.whatsapp}</td>
              <td className="p-2 text-center">
                <input type="checkbox" checked={s.isApproved} readOnly />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}