import { createClient } from '@/lib/supabase/server'

export async function logAudit(
  vaultId: string,
  action: string,
  metadata: Record<string, unknown> = {}
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('audit_logs').insert({
    vault_id: vaultId,
    user_id: user?.id ?? null,
    action,
    metadata,
  })
}
