// src/components/DataTable.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export type Column = { key: string; label: string }

export function DataTable({
  fetchUrl,
  columns,
}: {
  fetchUrl: string
  columns: Column[]
}) {
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => {
    axios.get(fetchUrl).then((res) => setRows(res.data))
  }, [fetchUrl])

  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="p-2 text-left">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="p-2">{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}