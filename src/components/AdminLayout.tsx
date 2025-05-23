// src/components/AdminLayout.tsx

import React, { ReactNode, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  TagIcon,
  UsersIcon,
  ClipboardIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export type View = 'dashboard' | 'products' | 'sellers' | 'orders' | 'logs'

const NAV: { key: View; Icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
  { key: 'dashboard', Icon: HomeIcon,      label: 'Dashboard' },
  { key: 'products',  Icon: TagIcon,       label: 'Products'  },
  { key: 'sellers',   Icon: UsersIcon,     label: 'Sellers'   },
  { key: 'orders',    Icon: ClipboardIcon, label: 'Orders'    },
  { key: 'logs',      Icon: ClockIcon,     label: 'Activity'  },
]

const drawerVariants = {
  hidden: { x: '-100%' },
  show:   { x: 0 },
}

export function AdminLayout({
  children,
  view,
  setView,
}: {
  children: ReactNode
  view: View
  setView: React.Dispatch<React.SetStateAction<View>>
}) {
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)

  // Toggle <html class="dark">
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col items-center w-16 bg-secondary dark:bg-primary border-r border-gray-200 dark:border-gray-800 py-4 space-y-4">
        {NAV.map(({ key, Icon, label }) => (
          <button
            key={key}
            title={label}
            onClick={() => setView(key)}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
              view === key ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <Icon className="h-6 w-6 text-primary dark:text-secondary" />
          </button>
        ))}

        <div className="mt-auto">
          <button
            onClick={() => setDark((d) => !d)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {dark ? (
              <SunIcon className="h-6 w-6 text-primary dark:text-secondary" />
            ) : (
              <MoonIcon className="h-6 w-6 text-primary dark:text-secondary" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden flex justify-between items-center px-4 py-3 bg-secondary dark:bg-primary border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => setOpen(true)}>
          <Bars3Icon className="h-6 w-6 text-primary dark:text-secondary" />
        </button>
        <h1 className="text-lg font-semibold text-primary dark:text-secondary">Admin</h1>
        <button onClick={() => setDark((d) => !d)}>
          {dark ? (
            <SunIcon className="h-6 w-6 text-primary dark:text-secondary" />
          ) : (
            <MoonIcon className="h-6 w-6 text-primary dark:text-secondary" />
          )}
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed inset-y-0 left-0 w-64 bg-secondary dark:bg-primary z-50 shadow-lg"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={drawerVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-primary dark:text-secondary">Menu</h2>
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-primary dark:text-secondary" />
              </button>
            </div>
            <nav className="flex flex-col space-y-2 p-4">
              {NAV.map(({ key, Icon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setView(key)
                    setOpen(false)
                  }}
                  className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                    view === key ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary dark:text-secondary" />
                  <span className="text-primary dark:text-secondary">{label}</span>
                </button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto py-6 bg-secondary dark:bg-primary">
        <div className="max-w-5xl mx-auto px-4">{children}</div>
      </main>
    </div>
  )
}
