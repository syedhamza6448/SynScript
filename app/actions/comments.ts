'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrCreateThreadForSource(vaultId: string, sourceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', threadId: null }

  const { data: existing } = await supabase
    .from('comment_threads')
    .select('id')
    .eq('vault_id', vaultId)
    .eq('source_id', sourceId)
    .single()

  if (existing) return { threadId: existing.id, error: null }

  const { data: inserted, error } = await supabase
    .from('comment_threads')
    .insert({ vault_id: vaultId, source_id: sourceId })
    .select('id')
    .single()

  if (error) return { error: error.message, threadId: null }
  return { threadId: inserted!.id, error: null }
}

export async function getCommentsForThread(threadId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('comments')
    .select('id, user_id, body, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  return { data: data ?? [], error: error?.message ?? null }
}

export async function addComment(threadId: string, body: string, vaultId: string) {
  if (!body.trim()) return { error: 'Comment is required' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('comments').insert({
    thread_id: threadId,
    user_id: user.id,
    body: body.trim(),
  })

  if (error) return { error: error.message }
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}
