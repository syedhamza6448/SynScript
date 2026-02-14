'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export function SiteFooter() {
  const { user, loading } = useAuth()

  return (
    <footer className="border-t-[4px] border-neo-black bg-secondary/40 mt-auto">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <Link
              href="/home"
              className="font-black text-3xl uppercase tracking-tight inline-block mb-5 border-b-4 border-neo-cyan pb-2 hover:bg-neo-cyan transition-colors"
            >
              SynScript
            </Link>
            <p className="text-muted-foreground font-medium max-w-md text-sm leading-relaxed">
              Collaborative Research & Citation Engine. Build Knowledge Vaults with verified sources and cross-referenced citations.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest mb-5 text-muted-foreground border-l-4 border-neo-yellow pl-3">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/home#how-it-works" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/vaults" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                  Vaults
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest mb-5 text-muted-foreground border-l-4 border-neo-pink pl-3">
              {!loading && user ? 'Account' : 'Get Started'}
            </h4>
            <ul className="space-y-3">
              {!loading && user ? (
                <>
                  <li>
                    <Link href="/profile" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/vaults" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                      My Vaults
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/login?signup=1" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-neo-cyan transition-all">
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t-[3px] border-neo-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-muted-foreground">
            © {new Date().getFullYear()} SynScript. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/home" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href={user ? '/vaults' : '/login'} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              {user ? 'Vaults' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
