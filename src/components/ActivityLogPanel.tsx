// ─────────────────────────────────────────────────────────────────────────────
// File: src/components/ActivityLogPanel.tsx

import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

export function ActivityLogPanel() {
  const { data: logs, error } = useSWR('/api/activity-logs', fetcher)

  if (error) return <div className="p-4 text-red-600">Failed to load logs</div>
  if (!logs) return <div className="p-4">Loading logs…</div>

  return (
    <div className="bg-white rounded shadow overflow-auto p-4 max-h-[600px]">
      <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
      <ul className="space-y-3">
        {logs.map((log: any) => (
          <li key={log.id} className="border-b pb-2">
            <p>
              <strong>{log.action}</strong> ({log.entityType}): {log.description}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}