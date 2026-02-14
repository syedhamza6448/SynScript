import { createClient } from '@/lib/supabase/server'

export type VaultRole = 'owner' | 'contributor' | 'viewer'

export async function getVaultRole(
  vaultId: string,
  userId: string | undefined
): Promise<VaultRole | null> {
  if (!userId) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('vault_members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', userId)
    .single()
  return (data?.role as VaultRole) ?? null
}

export async function canWriteVault(
  vaultId: string,
  userId: string | undefined
): Promise<boolean> {
  const role = await getVaultRole(vaultId, userId)
  return role === 'owner' || role === 'contributor'
}

export async function canReadVault(
  vaultId: string,
  userId: string | undefined
): Promise<boolean> {
  const role = await getVaultRole(vaultId, userId)
  return role !== null
}

export function canInvite(role: VaultRole | null): boolean {
  return role === 'owner'
}

export function canEditSource(role: VaultRole | null): boolean {
  return role === 'owner' || role === 'contributor'
}

export function canDeleteVault(role: VaultRole | null): boolean {
  return role === 'owner'
}
