'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-neo-black bg-background shadow-neo-sm">
      <nav className="container mx-auto flex items-center justify-between min-h-[64px] px-4 md:px-6">
        <Link
          href="/home"
          className="font-black text-xl md:text-2xl uppercase tracking-tight hover:opacity-90 transition-opacity"
        >
          SynScript
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login?signup=1">Sign up</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
