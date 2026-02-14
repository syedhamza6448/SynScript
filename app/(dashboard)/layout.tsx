import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
    <div className="min-h-screen flex flex-col bg-neo-bg">
      {accepted.length > 0 && <InviteNotification vaultIds={accepted} />}
      <header className="border-b-[5px] border-neo-black bg-neo-white shadow-neo-md">
        <div className="container mx-auto flex items-center justify-between min-h-[56px] px-6">
          <Link href="/vaults" className="font-black text-xl uppercase tracking-wide">
            SynScript
          </Link>
          <div className="flex items-center gap-4">
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
  )
}
