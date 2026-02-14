import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { BackgroundGrid } from '@/components/background-grid'
import { signOutAction } from '@/app/actions/auth'
import { acceptPendingInvites } from '@/app/actions/invites'
import { InviteNotification } from '@/components/invite-notification'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { accepted } = await acceptPendingInvites()

  return (
    <BackgroundGrid>
    <div className="min-h-screen flex flex-col relative z-10">
      {accepted.length > 0 && <InviteNotification vaultIds={accepted} />}
      <header className="border-b-[5px] border-neo-black bg-neo-white dark:bg-card shadow-neo-md">
        <div className="container mx-auto flex items-center justify-between min-h-[56px] px-6">
          <div className="flex items-center gap-6">
            <Link href="/vaults" className="font-black text-xl uppercase tracking-wide hover:opacity-90 transition-opacity">
              SynScript
            </Link>
            <Link href="/home" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm font-semibold text-muted-foreground">{user.email}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
    </BackgroundGrid>
  )
}
