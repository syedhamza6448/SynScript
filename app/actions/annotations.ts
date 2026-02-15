'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAnnotation(
  sourceId: string,
  vaultId: string,
  note: string,
  pageNumber?: number
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
    ...(pageNumber != null && pageNumber > 0 && { page_number: pageNumber }),
  })

  if (error) return { error: error.message }
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}

export async function updateAnnotation(
  annotationId: string,
  vaultId: string,
  note: string,
  pageNumber?: number
) {
  if (!note.trim()) return { error: 'Note is required' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: ann } = await supabase
    .from('annotations')
    .select('id, source_id, user_id')
    .eq('id', annotationId)
    .single()

  if (!ann || ann.user_id !== user.id) return { error: 'Annotation not found or you can only edit your own' }

  const { data: source } = await supabase
    .from('sources')
    .select('vault_id')
    .eq('id', ann.source_id)
    .single()

  if (!source || source.vault_id !== vaultId) return { error: 'Source not found' }

  const { error } = await supabase
    .from('annotations')
    .update({
      note: note.trim(),
      ...(pageNumber != null && pageNumber > 0 && { page_number: pageNumber }),
    })
    .eq('id', annotationId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath(`/vaults/${vaultId}`)
  revalidatePath(`/vaults/${vaultId}/pdf/${ann.source_id}`)
  return {}
}

export async function deleteAnnotation(annotationId: string, vaultId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: ann } = await supabase
    .from('annotations')
    .select('id, source_id')
    .eq('id', annotationId)
    .eq('user_id', user.id)
    .single()

  if (!ann) return { error: 'Annotation not found or you can only delete your own' }

  const { data: source } = await supabase
    .from('sources')
    .select('vault_id')
    .eq('id', ann.source_id)
    .single()

  if (!source || source.vault_id !== vaultId) return { error: 'Source not found' }

  const { error } = await supabase
    .from('annotations')
    .delete()
    .eq('id', annotationId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath(`/vaults/${vaultId}`)
  revalidatePath(`/vaults/${vaultId}/pdf/${ann.source_id}`)
  return {}
}
