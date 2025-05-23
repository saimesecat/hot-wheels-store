// ─────────────────────────────────────────────────────────────────────────────
// File: src/lib/fetcher.ts

import axios from 'axios'

// Expose your API_KEY to the client via NEXT_PUBLIC_*
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

// A simple fetcher that injects your x-api-key header
export const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: { 'x-api-key': API_KEY },
    })
    .then((res) => res.data)