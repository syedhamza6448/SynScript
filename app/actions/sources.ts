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

const updateSourceSchema = z.object({
  title: z.string().min(1).optional(),
  url: z.string().url().optional().or(z.literal('')),
})

export async function updateSource(
  vaultId: string,
  sourceId: string,
  input: { title?: string; url?: string }
) {
  const parsed = updateSourceSchema.safeParse(input)
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
    return { error: 'Only owners and contributors can update sources' }
  }

  const payload: { title?: string; url?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  }
  if (parsed.data?.title !== undefined) payload.title = parsed.data.title
  if (parsed.data?.url !== undefined) payload.url = parsed.data.url || null

  const { error } = await supabase
    .from('sources')
    .update(payload)
    .eq('id', sourceId)
    .eq('vault_id', vaultId)

  if (error) return { error: error.message }
  await logAudit(vaultId, 'source_updated', { source_id: sourceId, title: payload.title, url: payload.url })
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

  const { data: source } = await supabase
    .from('sources')
    .select('file_path')
    .eq('id', sourceId)
    .eq('vault_id', vaultId)
    .single()

  if (source?.file_path) {
    await supabase.storage.from('pdfs').remove([source.file_path])
  }

  const { error } = await supabase
    .from('sources')
    .delete()
    .eq('id', sourceId)
    .eq('vault_id', vaultId)

  if (error) return { error: error.message }
  await logAudit(vaultId, 'source_deleted', { source_id: sourceId })
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}

export async function deleteSourcesBulk(vaultId: string, sourceIds: string[]) {
  if (!sourceIds.length) return { error: 'No sources selected' }

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

  const { data: sources } = await supabase
    .from('sources')
    .select('id, file_path')
    .eq('vault_id', vaultId)
    .in('id', sourceIds)

  const paths = (sources ?? []).filter((s): s is { id: string; file_path: string } => !!s.file_path).map((s) => s.file_path)
  if (paths.length) await supabase.storage.from('pdfs').remove(paths)

  const { error } = await supabase
    .from('sources')
    .delete()
    .eq('vault_id', vaultId)
    .in('id', sourceIds)

  if (error) return { error: error.message }
  await logAudit(vaultId, 'sources_bulk_deleted', { source_ids: sourceIds, count: sourceIds.length })
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}
