// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const [dark, setDark] = useState(false)

  // load saved preference
  useEffect(() => {
    const stored = localStorage.getItem('dark')
    if (stored !== null) setDark(stored === 'true')
  }, [])

  // apply <html class="dark"> and save
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark', dark.toString())
  }, [dark])

  return (
    <main
      className={`
        ${inter.className}
        font-sans
        bg-gray-50 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        min-h-screen
      `}
    >
      <button
        onClick={() => setDark((d) => !d)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-200 dark:bg-gray-800 rounded"
      >
        {dark ? '🌞 Light' : '🌙 Dark'}
      </button>

      <Component {...pageProps} />
    </main>
  )
}