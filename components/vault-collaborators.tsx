'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Edit2, Eye, MoreVertical, Trash2, User } from 'lucide-react'
import { updateMemberRole, removeMember } from '@/app/actions/members'
import { useToast } from '@/hooks/use-toast'
import { useVaultPresence } from '@/lib/vault-presence-context'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

export type MemberWithEmail = {
  id: string
  role: string
  user_id: string
  email: string | null
}

interface VaultCollaboratorsProps {
  vaultId: string
  members: MemberWithEmail[]
  currentUserId: string
  isOwner: boolean
}

export function VaultCollaborators({
  vaultId,
  members,
  currentUserId,
  isOwner,
}: VaultCollaboratorsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [removeConfirm, setRemoveConfirm] = useState<{ memberId: string } | null>(null)
  const [removing, setRemoving] = useState(false)
  const activeUserIds = useVaultPresence()

  async function handleChangeRole(memberId: string, newRole: 'contributor' | 'viewer') {
    setLoading(memberId)
    try {
      const { error } = await updateMemberRole(
        vaultId,
        memberId,
        newRole
      )
      if (error) throw new Error(error)
      router.refresh()
      toast({ title: 'Role updated', description: 'Collaborator access has been updated.' })
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to update role', variant: 'destructive' })
    } finally {
      setLoading(null)
    }
  }

  async function handleRemove(memberId: string) {
    setRemoveConfirm({ memberId })
  }

  async function handleConfirmRemove() {
    if (!removeConfirm) return
    setRemoving(true)
    try {
      const { error } = await removeMember(vaultId, removeConfirm.memberId)
      if (error) throw new Error(error)
      setRemoveConfirm(null)
      router.refresh()
      toast({ title: 'Removed', description: 'Collaborator has been removed from the vault.' })
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to remove', variant: 'destructive' })
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <div className="border-[4px] border-neo-black bg-card p-3 sm:p-4 shadow-neo-md animate-neo-slide-up h-fit">
        <h3 className="text-xs sm:text-sm font-black uppercase mb-3 flex items-center gap-2">
          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          Collaborators
        </h3>
        <ul className="space-y-2 max-h-[min(50vh,400px)] overflow-y-auto pr-1">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2.5 px-3 border-[2px] border-neo-black bg-secondary/50 hover:bg-secondary hover:shadow-neo-sm transition-all duration-150 rounded-sm"
            >
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <span className="flex items-center gap-2 min-w-0 overflow-hidden">
                <span className="text-xs sm:text-sm font-bold truncate" title={m.email ?? undefined}>
                  {m.email ?? `User ${m.user_id.slice(0, 8)}...`}
                </span>
                {activeUserIds.has(m.user_id) && (
                  <span
                    className="shrink-0 w-2 h-2 rounded-full bg-green-500 border-2 border-background shadow-sm animate-pulse"
                    title="Active now"
                  />
                )}
              </span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase shrink-0 ${
                  m.role === 'owner'
                    ? 'bg-neo-yellow border-2 border-neo-black'
                    : m.role === 'contributor'
                    ? 'bg-neo-cyan/80 border-2 border-neo-black'
                    : 'bg-neo-gray border-2 border-neo-black'
                }`}
              >
                {m.role === 'owner' ? (
                  'Owner'
                ) : m.role === 'contributor' ? (
                  <>
                    <Edit2 className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">Edit</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">View-only</span>
                  </>
                )}
              </span>
              {isOwner && m.role !== 'owner' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      disabled={!!loading}
                      aria-label="Member options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-[3px] border-neo-black">
                    <DropdownMenuItem
                      onClick={() => handleChangeRole(m.id, 'contributor')}
                      disabled={loading === m.id || m.role === 'contributor'}
                    >
                      <Edit2 className="h-4 w-4 mr-2 shrink-0" />
                      Set as Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleChangeRole(m.id, 'viewer')}
                      disabled={loading === m.id || m.role === 'viewer'}
                    >
                      <Eye className="h-4 w-4 mr-2 shrink-0" />
                      Set as View-only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleRemove(m.id)}
                      disabled={loading === m.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2 shrink-0" />
                      Remove access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>

    <ConfirmDialog
      open={!!removeConfirm}
      onOpenChange={(open) => !open && setRemoveConfirm(null)}
      title="Remove collaborator"
      description="Remove this collaborator from the vault? They will lose access to all vault content."
      confirmLabel="Remove"
      cancelLabel="Cancel"
      variant="destructive"
      onConfirm={handleConfirmRemove}
      loading={removing}
    />
  </>
  )
}
