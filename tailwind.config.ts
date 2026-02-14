import type { Config } from 'tailwindcss'

const config: Config = {
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
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-gray': '#E0E0E0',
        'neo-bg': '#FAFAFA',
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
        'neo-sm': '3px 3px 0px #000',
        'neo-md': '5px 5px 0px #000',
        'neo-lg': '8px 8px 0px #000',
        'neo-xl': '12px 12px 0px #000',
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
