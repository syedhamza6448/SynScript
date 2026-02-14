'use client'

import { cn } from '@/lib/utils'

interface BackgroundGridProps {
  className?: string
  children?: React.ReactNode
}

export function BackgroundGrid({ className, children }: BackgroundGridProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden', className)}>
      {/* Subtle grid - clean, low contrast */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80" aria-hidden />

      {/* SRS-themed vectors: research, vault, citation - minimal & playful */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04] dark:opacity-[0.06]" aria-hidden>
        {/* Book icon - top left (research) */}
        <svg className="absolute top-16 left-16 w-20 h-20 text-neo-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="12" y1="6" x2="12" y2="14" />
        </svg>
        {/* Link icon - bottom right (citation) */}
        <svg className="absolute bottom-20 right-20 w-16 h-16 text-neo-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {/* Folder icon - top right (vault) */}
        <svg className="absolute top-24 right-24 w-14 h-14 text-neo-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
