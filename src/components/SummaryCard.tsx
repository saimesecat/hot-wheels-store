// src/components/SummaryCard.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export function SummaryCard({
  title,
  fetchUrl,
}: {
  title: string
  fetchUrl: string
}) {
  const [value, setValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get<any[]>(fetchUrl)
      .then((res) => setValue(res.data.length))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [fetchUrl])

  return (
    <div className="p-4 rounded shadow bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">Error</p>
      ) : (
        <p className="text-3xl font-bold">{value}</p>
      )}
    </div>
  )
}