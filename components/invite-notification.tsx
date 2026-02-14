'use client'

import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function InviteNotification({ vaultIds }: { vaultIds: string[] }) {
  const { toast } = useToast()

  useEffect(() => {
    if (vaultIds.length > 0) {
      toast({
        title: 'You were added!',
        description: `You were added to ${vaultIds.length} vault${vaultIds.length > 1 ? 's' : ''} as a collaborator.`,
      })
    }
  }, [vaultIds.length, toast])

  return null
}
