import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neo-yellow': '#FFEB3B',
        'neo-cyan': '#00BCD4',
        'neo-pink': '#FF4081',
        'neo-green': '#4CAF50',
        'neo-orange': '#FF9800',
        'neo-purple': '#9C27B0',
        'neo-black': 'var(--neo-black)',
        'neo-white': 'var(--neo-white)',
        'neo-gray': 'var(--neo-gray)',
        'neo-bg': 'var(--neo-bg-light)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      boxShadow: {
        'neo-sm': 'var(--shadow-sm)',
        'neo-md': 'var(--shadow-md)',
        'neo-lg': 'var(--shadow-lg)',
        'neo-xl': 'var(--shadow-xl)',
      },
      borderRadius: {
        lg: '0',
        md: '0',
        sm: '0',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
