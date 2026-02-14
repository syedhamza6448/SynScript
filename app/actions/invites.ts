'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function acceptPendingInvites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { accepted: [] as string[] }

  const { data: invites } = await supabase
    .from('vault_invites')
    .select('id, vault_id, role')
    .eq('email', user.email.toLowerCase())

  if (!invites?.length) return { accepted: [] }

  const accepted: string[] = []
  for (const inv of invites) {
    const { error } = await supabase.from('vault_members').insert({
      vault_id: inv.vault_id,
      user_id: user.id,
      role: inv.role,
    })
    if (!error) {
      await supabase.from('vault_invites').delete().eq('id', inv.id)
      accepted.push(inv.vault_id)
    }
  }
  if (accepted.length) revalidatePath('/vaults')
  return { accepted }
}
