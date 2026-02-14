'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    const supabase = createClient()

    const sourcesChannel = supabase
      .channel(`sources:${vaultId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sources',
          filter: `vault_id=eq.${vaultId}`,
        },
        () => {
          router.refresh()
        }
      )
      .subscribe()

    const membersChannel = supabase
      .channel(`members:${vaultId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vault_members',
          filter: `vault_id=eq.${vaultId}`,
        },
        () => {
          toast({
            title: 'New collaborator',
            description: 'A new collaborator was added to this vault.',
          })
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(sourcesChannel)
      supabase.removeChannel(membersChannel)
    }
  }, [vaultId, router, toast])

  return <>{children}</>
}
