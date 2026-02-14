'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPdf(
  vaultId: string,
  sourceId: string,
  formData: FormData
) {
  const file = formData.get('file') as File | null
  if (!file || file.type !== 'application/pdf') {
    return { error: 'Please upload a PDF file' }
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
    return { error: 'Only owners and contributors can upload files' }
  }

  const path = `${vaultId}/${sourceId}/${Date.now()}.pdf`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from('pdfs')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (error) return { error: error.message }

  const { error: updateError } = await supabase
    .from('sources')
    .update({ file_path: path })
    .eq('id', sourceId)
    .eq('vault_id', vaultId)

  if (updateError) return { error: updateError.message }
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}
