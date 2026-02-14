'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const addSourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url().optional().or(z.literal('')),
})

export async function addSource(
  vaultId: string,
  input: { url?: string; title: string }
) {
  const parsed = addSourceSchema.safeParse({
    title: input.title,
    url: input.url || '',
  })
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors[0] }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: member } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (member?.role !== 'owner' && member?.role !== 'contributor') {
    return { error: 'Only owners and contributors can add sources' }
  }

  const { data: inserted, error } = await supabase.from('sources').insert({
    vault_id: vaultId,
    title: parsed.data.title,
    url: parsed.data.url || null,
  }).select('id').single()

  if (error) return { error: error.message }
  if (inserted) await logAudit(vaultId, 'source_added', { source_id: inserted.id, title: parsed.data.title })
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}

export async function deleteSource(vaultId: string, sourceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: member } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (member?.role !== 'owner' && member?.role !== 'contributor') {
    return { error: 'Only owners and contributors can delete sources' }
  }

  const { error } = await supabase
    .from('sources')
    .delete()
    .eq('id', sourceId)
    .eq('vault_id', vaultId)

  if (error) return { error: error.message }
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}
