// src/components/AdminAppShell.tsx
import React, { ReactNode, useEffect, useState } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import toast, { Toaster } from 'react-hot-toast'
import useSWR from 'swr'
import { AnimatePresence, motion } from 'framer-motion'
import { AdminLayout, View } from './AdminLayout'

// 1) NProgress route loading
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

// 2) SWR global fetcher + real-time polling
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminAppShell({
  children,
  view,
  setView,
}: {
  children: ReactNode
  view: View
  setView: React.Dispatch<React.SetStateAction<View>>
}) {
  const [dark, setDark] = useState(false)

  // 3) Dark-mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // 4) Real-time data (example: orders count)
  const { data: orders } = useSWR(
    ['/api/orders', view === 'orders'],
    fetcher,
    { refreshInterval: 15_000 } // poll every 15s
  )

  // 5) Keyboard shortcut for global search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/') {
        e.preventDefault()
        // focus your search input, if any:
        const el = document.querySelector<HTMLInputElement>('#global-search')
        el?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* 6) Toast container */}
      <Toaster position="top-right" />

      <AdminLayout view={view} setView={setView}>
        {/* 7) Page-level transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/**
             * 8) Here you render your actual panels:
             *    - <Dashboard orders={orders?.length} …/>
             *    - <Products …/>
             *    - etc.
             *    Each of those components can:
             *      • Show a skeleton if data isn’t loaded yet.
             *      • Call toast.success/error(...) on actions.
             **/}
            {children}
          </motion.div>
        </AnimatePresence>
      </AdminLayout>
    </>
  )
}