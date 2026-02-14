import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getVaultRole } from '@/lib/auth/rbac'
import { VaultDetail } from '@/components/vault-detail'
import { InviteMemberDialog } from '@/components/invite-member-dialog'
import { RealtimeVault } from '@/components/realtime-vault'

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

  const { data: members } = await supabase
    .from('vault_members')
    .select('id, role, user_id')
    .eq('vault_id', id)

  return (
    <RealtimeVault vaultId={id}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{vault.name}</h1>
            {vault.description && (
              <p className="text-muted-foreground mt-1">{vault.description}</p>
            )}
          </div>
          {role === 'owner' && (
            <InviteMemberDialog vaultId={id} vaultName={vault.name} />
          )}
        </div>

        <VaultDetail
          vaultId={id}
          sources={sources ?? []}
          role={role}
          members={members ?? []}
        />
      </div>
    </RealtimeVault>
  )
}
