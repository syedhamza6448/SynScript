import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BackgroundGrid } from '@/components/background-grid'
import { SharedNavbar } from '@/components/shared-navbar'
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
      <SharedNavbar />
      <main className="flex-1">{children}</main>
    </div>
    </BackgroundGrid>
  )
}
