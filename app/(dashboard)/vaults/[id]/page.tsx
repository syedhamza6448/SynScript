import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getVaultRole } from '@/lib/auth/rbac'
import { getMembersWithEmails } from '@/lib/members'
import { Button } from '@/components/ui/button'
import { VaultDetail } from '@/components/vault-detail'
import { InviteMemberDialog } from '@/components/invite-member-dialog'
import { VaultCollaborators } from '@/components/vault-collaborators'
import { RealtimeVault } from '@/components/realtime-vault'
import { VaultPresenceProvider } from '@/lib/vault-presence-context'

export default async function VaultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vault } = await supabase
    .from('vaults')
    .select('*')
    .eq('id', id)
    .single()

  if (!vault) notFound()

  const role = await getVaultRole(id, user.id)
  if (!role) redirect('/vaults')

  const { data: rawSources } = await supabase
    .from('sources')
    .select(`
      id,
      url,
      title,
      file_path,
      created_at,
      annotations (
        id,
        note,
        user_id,
        created_at
      )
    `)
    .eq('vault_id', id)
    .order('created_at', { ascending: false })

  const sources = await Promise.all(
    (rawSources ?? []).map(async (s) => {
      let pdfUrl = null
      if (s.file_path) {
        const { data } = await supabase.storage
          .from('pdfs')
          .createSignedUrl(s.file_path, 3600)
        pdfUrl = data?.signedUrl ?? null
      }
      return { ...s, pdf_url: pdfUrl }
    })
  )

  const { data: rawMembers } = await supabase
    .from('vault_members')
    .select('id, role, user_id')
    .eq('vault_id', id)

  const members = await getMembersWithEmails(rawMembers ?? [])

  return (
    <RealtimeVault vaultId={id}>
      <VaultPresenceProvider vaultId={id} currentUserId={user.id}>
      <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase border-l-4 sm:border-l-8 border-neo-cyan pl-3 sm:pl-4 truncate" title={vault.name}>{vault.name}</h1>
            {vault.description && (
              <p className="text-muted-foreground mt-2 font-medium">{vault.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/vaults/${id}/audit`}>Audit logs</Link>
            </Button>
            {role === 'owner' && (
              <InviteMemberDialog vaultId={id} vaultName={vault.name} />
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[1fr,280px] xl:grid-cols-[1fr,320px]">
          <VaultDetail
            vaultId={id}
            sources={sources ?? []}
            role={role}
            members={members}
          />
          <VaultCollaborators
            vaultId={id}
            members={members}
            currentUserId={user.id}
            isOwner={role === 'owner'}
          />
        </div>
      </div>
      </VaultPresenceProvider>
    </RealtimeVault>
  )
}
