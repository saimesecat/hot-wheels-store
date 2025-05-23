import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#111827',
        secondary: '#F9FAFB',
        accent: '#FF7E1B',
      },
    },
  },
  plugins: [],
}

export default config