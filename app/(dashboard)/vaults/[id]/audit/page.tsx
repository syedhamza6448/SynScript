import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getVaultRole } from '@/lib/auth/rbac'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AuditLogTable } from '@/components/audit-log-table'

export default async function VaultAuditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: vaultId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const role = await getVaultRole(vaultId, user.id)
  if (!role) redirect('/vaults')

  const { data: vault } = await supabase
    .from('vaults')
    .select('name')
    .eq('id', vaultId)
    .single()

  if (!vault) notFound()

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('id, user_id, action, metadata, created_at')
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: false })
    .limit(500)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/vaults/${vaultId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to vault
          </Link>
        </Button>
        <a
          href={`/api/vaults/${vaultId}/audit-logs?format=csv`}
          download
          className="text-sm font-bold text-neo-cyan border-b-2 border-neo-cyan hover:bg-neo-cyan hover:text-neo-black transition-colors px-2 py-1"
        >
          Export CSV
        </a>
      </div>
      <h1 className="text-2xl font-black uppercase border-l-8 border-neo-cyan pl-4 mb-6">
        Audit logs — {vault.name}
      </h1>
      <AuditLogTable logs={logs ?? []} />
    </div>
  )
}
