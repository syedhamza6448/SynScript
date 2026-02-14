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
    <div className="min-h-screen flex flex-col">
      {accepted.length > 0 && <InviteNotification vaultIds={accepted} />}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link href="/vaults" className="font-bold text-xl">
            SynScript
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
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
