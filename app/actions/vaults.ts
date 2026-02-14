'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const createVaultSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

export async function createVault(input: { name: string; description?: string }) {
  const parsed = createVaultSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors[0] }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Use service client for insert to avoid RLS issues with server action cookie context.
  // We've already verified the user; owner_id is set from authenticated user.
  const admin = createServiceClient()
  const { data, error } = await admin
    .from('vaults')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      owner_id: user.id,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  if (data?.id) await logAudit(data.id, 'vault_created', { name: parsed.data.name })
  revalidatePath('/vaults')
  return { data }
}

export async function updateVault(
  vaultId: string,
  input: { name?: string; description?: string }
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

  if (member?.role !== 'owner') return { error: 'Only owners can update vaults' }

  const { error } = await supabase
    .from('vaults')
    .update({
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', vaultId)

  if (error) return { error: error.message }
  revalidatePath('/vaults')
  revalidatePath(`/vaults/${vaultId}`)
  return {}
}

export async function deleteVault(vaultId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: member } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', user.id)
    .single()

  if (member?.role !== 'owner') return { error: 'Only owners can delete vaults' }

  const { error } = await supabase.from('vaults').delete().eq('id', vaultId)

  if (error) return { error: error.message }
  revalidatePath('/vaults')
  return {}
}
