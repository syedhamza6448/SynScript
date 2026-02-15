import { redis } from '@/lib/redis'

const VAULT_ROLE_TTL_SEC = 300 // 5 minutes
const PREFIX = '@synscript/cache'

export type VaultRole = 'owner' | 'contributor' | 'viewer'

/**
 * Cache vault role for a user (high-traffic optimization per SRS).
 * Invalidated implicitly by TTL; call invalidateVaultRole when role changes.
 */
export async function getCachedVaultRole(
  vaultId: string,
  userId: string
): Promise<VaultRole | null> {
  if (!redis) return null
  try {
    const key = `${PREFIX}/vault-role:${vaultId}:${userId}`
    const val = await redis.get<string>(key)
    return val as VaultRole | null
  } catch {
    return null
  }
}

export async function setCachedVaultRole(
  vaultId: string,
  userId: string,
  role: VaultRole
): Promise<void> {
  if (!redis) return
  try {
    const key = `${PREFIX}/vault-role:${vaultId}:${userId}`
    await redis.set(key, role, { ex: VAULT_ROLE_TTL_SEC })
  } catch {
    // ignore
  }
}

export async function invalidateVaultRole(vaultId: string, userId?: string): Promise<void> {
  if (!redis) return
  try {
    if (userId) {
      await redis.del(`${PREFIX}/vault-role:${vaultId}:${userId}`)
    } else {
      const keys = await redis.keys(`${PREFIX}/vault-role:${vaultId}:*`)
      if (keys.length) await redis.del(...keys)
    }
  } catch {
    // ignore
  }
}
