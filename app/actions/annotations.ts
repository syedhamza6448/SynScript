'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAnnotation(
  sourceId: string,
  vaultId: string,
  note: string
) {
  if (!note.trim()) return { error: 'Note is required' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: source } = await supabase
    .from('sources')
    .select('vault_id')
    .eq('id', sourceId)
    .single()

  if (!source) return { error: 'Source not found' }

  const { data: member } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', source.vault_id)
    .eq('user_id', user.id)
    .single()

  if (member?.role !== 'owner' && member?.role !== 'contributor') {
    return { error: 'Only owners and contributors can add annotations' }
  }

  const { error } = await supabase.from('annotations').insert({
    source_id: sourceId,
    user_id: user.id,
    note: note.trim(),
  })

  if (error) return { error: error.message }
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}
