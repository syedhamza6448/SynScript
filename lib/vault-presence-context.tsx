'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const VaultPresenceContext = createContext<Set<string>>(new Set())

export function useVaultPresence() {
  return useContext(VaultPresenceContext)
}

function getActiveIdsFromState(state: Record<string, unknown[]>): Set<string> {
  const ids = new Set<string>()
  Object.values(state).forEach((presences) => {
    presences.forEach((p: unknown) => {
      const o = p as { user_id?: string }
      if (o?.user_id) ids.add(o.user_id)
    })
  })
  return ids
}

export function VaultPresenceProvider({
  vaultId,
  currentUserId,
  children,
}: {
  vaultId: string
  currentUserId: string
  children: React.ReactNode
}) {
  const [activeUserIds, setActiveUserIds] = useState<Set<string>>(new Set())
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`vault-presence:${vaultId}`, {
      config: { presence: { key: currentUserId } },
    })
    channelRef.current = channel

    const sync = () => {
      const state = channelRef.current?.presenceState() ?? {}
      setActiveUserIds(getActiveIdsFromState(state as Record<string, unknown[]>))
    }

    channel
      .on('presence', { event: 'sync' }, sync)
      .on('presence', { event: 'join' }, sync)
      .on('presence', { event: 'leave' }, sync)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: currentUserId })
        }
      })

    return () => {
      channel.untrack()
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [vaultId, currentUserId])

  return (
    <VaultPresenceContext.Provider value={activeUserIds}>
      {children}
    </VaultPresenceContext.Provider>
  )
}
