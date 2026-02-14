'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function inviteMember(
  vaultId: string,
  email: string,
  role: 'contributor' | 'viewer'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: member } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (member?.role !== 'owner') {
    return { error: 'Only owners can invite members' }
  }

  // Use service role to look up user by email and add directly if they exist
  const { createServiceClient } = await import('@/lib/supabase/server')
  const adminClient = createServiceClient()

  const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
  const targetUser = users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())

  if (targetUser) {
    // User exists - add directly
    const { error } = await supabase.from('vault_members').insert({
      vault_id: vaultId,
      user_id: targetUser.id,
      role,
    })
    if (error) {
      if (error.code === '23505') return { error: 'User is already a member' }
      return { error: error.message }
    }
    await logAudit(vaultId, 'member_added', { email, role })
  } else {
    // User doesn't exist yet - store invite for when they sign up
    const { error } = await supabase.from('vault_invites').upsert(
      { vault_id: vaultId, email: email.toLowerCase(), role },
      { onConflict: 'vault_id,email' }
    )
    if (error) return { error: error.message }
  }

  revalidatePath(`/vaults/${vaultId}`)
  return {}
}
