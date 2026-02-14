'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface RealtimeVaultProps {
  vaultId: string
  children: React.ReactNode
}

export function RealtimeVault({ vaultId, children }: RealtimeVaultProps) {
  const router = useRouter()
  const { toast } = useToast()
  const routerRef = useRef(router)
  const toastRef = useRef(toast)
  routerRef.current = router
  toastRef.current = toast

  useEffect(() => {
    const supabase = createClient()

    const handleMembersChange = (payload: { eventType: string }) => {
      if (payload.eventType === 'INSERT') {
        toastRef.current({
          title: 'New collaborator',
          description: 'A new collaborator was added to this vault.',
        })
      } else if (payload.eventType === 'UPDATE') {
        toastRef.current({
          title: 'Collaborator updated',
          description: "A collaborator's role was changed.",
        })
      } else if (payload.eventType === 'DELETE') {
        toastRef.current({
          title: 'Collaborator removed',
          description: 'A collaborator was removed from the vault.',
        })
      }
      routerRef.current.refresh()
    }

    const sourcesChannel = supabase
      .channel(`sources-${vaultId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sources',
          filter: `vault_id=eq.${vaultId}`,
        },
        () => routerRef.current.refresh()
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('[Realtime] sources subscription error')
        }
      })

    const membersChannel = supabase
      .channel(`members-${vaultId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vault_members',
          filter: `vault_id=eq.${vaultId}`,
        },
        handleMembersChange
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('[Realtime] vault_members subscription error - ensure table is in supabase_realtime publication and REPLICA IDENTITY FULL is set')
        }
      })

    return () => {
      supabase.removeChannel(sourcesChannel)
      supabase.removeChannel(membersChannel)
    }
  }, [vaultId])

  return <>{children}</>
}
