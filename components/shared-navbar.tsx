'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { User as UserIcon, LayoutDashboard, FolderOpen, LogOut, Settings } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'

interface SharedNavbarProps {
  variant?: 'default' | 'minimal'
}

export function SharedNavbar({ variant = 'default' }: SharedNavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border-nav bg-background shadow-neo-sm">
      <nav className="container mx-auto flex items-center justify-between min-h-[64px] px-4 md:px-6">
        <Link
          href="/home"
          className="font-black text-xl md:text-2xl uppercase tracking-tight hover:opacity-90 transition-opacity"
        >
          SynScript
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          {!loading && (
            user ? (
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
          )}
        </div>
      </nav>
    </header>
  )
}
