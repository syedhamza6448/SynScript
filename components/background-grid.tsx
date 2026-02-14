'use client'

import { cn } from '@/lib/utils'

interface BackgroundGridProps {
  className?: string
  children?: React.ReactNode
}

export function BackgroundGrid({ className, children }: BackgroundGridProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden', className)}>
      {/* Grid pattern - uses CSS variable for theme-aware color */}
      <div
        className="absolute inset-0 bg-grid-pattern"
        aria-hidden
      />

      {/* Decorative geometric vectors - corners and accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Top-left corner L shape */}
        <svg
          className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 text-neo-cyan dark:text-neo-cyan/60"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <line x1="0" y1="20" x2="80" y2="20" />
          <line x1="20" y1="0" x2="20" y2="80" />
        </svg>

        {/* Bottom-right corner L shape */}
        <svg
          className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 text-neo-pink dark:text-neo-pink/60"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <line x1="20" y1="80" x2="100" y2="80" />
          <line x1="80" y1="20" x2="80" y2="100" />
        </svg>

        {/* Top-right accent */}
        <svg
          className="absolute top-12 right-12 w-24 h-24 md:w-32 md:h-32 text-neo-yellow dark:text-neo-yellow/50"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="10" y="10" width="80" height="80" />
        </svg>

        {/* Bottom-left accent */}
        <svg
          className="absolute bottom-24 left-8 w-20 h-20 md:w-28 md:h-28 text-neo-cyan dark:text-neo-cyan/50"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="50,5 95,95 5,95" />
        </svg>

        {/* Center-right floating square */}
        <svg
          className="absolute top-1/2 right-[15%] -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 text-neo-orange dark:text-neo-orange/40"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
        </svg>

        {/* Center-left floating shape */}
        <svg
          className="absolute top-1/3 left-[10%] w-12 h-12 md:w-16 md:h-16 text-neo-green dark:text-neo-green/40"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
