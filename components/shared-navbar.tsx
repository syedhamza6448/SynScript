'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User as UserIcon, LayoutDashboard, FolderOpen, LogOut, Settings, Menu, X } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'
import { VaultNotificationBell } from '@/components/vault-notification-bell'

interface SharedNavbarProps {
  variant?: 'default' | 'minimal'
}

export function SharedNavbar({ variant = 'default' }: SharedNavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isVaultPage = pathname?.match(/^\/vaults\/[a-f0-9-]+(?:\/|$)/i)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const desktopNav = user ? (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" size="sm">
          <LayoutDashboard className="h-4 w-4 mr-1.5 stroke-[2.25]" />
          Dashboard
        </Button>
      </Link>
      <Link href="/vaults">
        <Button variant="ghost" size="sm">
          <FolderOpen className="h-4 w-4 mr-1.5 stroke-[2.25]" />
          Vaults
        </Button>
      </Link>
      {isVaultPage && <VaultNotificationBell />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <UserIcon className="h-4 w-4 stroke-[2.25]" />
            <span className="hidden sm:inline truncate max-w-[120px]">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <form action={signOutAction}>
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Log in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/login?signup=1">Sign up</Link>
      </Button>
    </>
  )

  const mobileNav = user ? (
    <>
      {isVaultPage && (
        <div className="flex items-center gap-2 py-2 px-3">
          <VaultNotificationBell />
          <span className="text-sm font-bold">Recent changes</span>
        </div>
      )}
      <Link href="/dashboard" onClick={closeMobile} className="block py-2 px-3 font-bold text-sm border-b-2 border-transparent hover:border-neo-cyan hover:bg-secondary/50">
        <LayoutDashboard className="h-4 w-4 mr-2 inline" />
        Dashboard
      </Link>
      <Link href="/vaults" onClick={closeMobile} className="block py-2 px-3 font-bold text-sm border-b-2 border-transparent hover:border-neo-cyan hover:bg-secondary/50">
        <FolderOpen className="h-4 w-4 mr-2 inline" />
        Vaults
      </Link>
      <Link href="/profile" onClick={closeMobile} className="block py-2 px-3 font-bold text-sm border-b-2 border-transparent hover:border-neo-cyan hover:bg-secondary/50">
        <Settings className="h-4 w-4 mr-2 inline" />
        Profile
      </Link>
      <form action={signOutAction}>
        <button type="submit" onClick={closeMobile} className="w-full text-left py-2 px-3 font-bold text-sm text-destructive hover:bg-destructive/10 flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </button>
      </form>
      <p className="text-xs text-muted-foreground px-3 pt-2 truncate">{user.email}</p>
    </>
  ) : (
    <div className="flex flex-col gap-2 pt-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login" onClick={closeMobile} className="justify-center">Log in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/login?signup=1" onClick={closeMobile} className="justify-center">Sign up</Link>
      </Button>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border-nav bg-background shadow-neo-sm">
      <nav className="container mx-auto flex items-center justify-between min-h-[56px] md:min-h-[64px] px-4 md:px-6">
        <Link
          href="/home"
          className="font-black text-lg md:text-2xl uppercase tracking-tight hover:opacity-90 transition-opacity shrink-0"
        >
          SynScript
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <ThemeToggle />
          {!loading && desktopNav}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={closeMobile}
            aria-hidden
          />
          <div className="absolute left-0 right-0 top-full z-50 md:hidden border-b-[3px] border-border-nav bg-background shadow-neo-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col">
              {!loading && mobileNav}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
