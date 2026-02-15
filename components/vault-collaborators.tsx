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
    if (!confirm('Remove this collaborator from the vault?')) return
    setLoading(memberId)
    try {
      const { error } = await removeMember(vaultId, memberId)
      if (error) throw new Error(error)
      router.refresh()
      toast({ title: 'Removed', description: 'Collaborator has been removed from the vault.' })
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to remove', variant: 'destructive' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="border-[4px] border-neo-black bg-card p-3 sm:p-4 shadow-neo-md animate-neo-slide-up">
      <h3 className="text-xs sm:text-sm font-black uppercase mb-3 flex items-center gap-2">
        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Collaborators
      </h3>
      <ul className="space-y-2 stagger-children">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between gap-2 py-2 px-3 border-[2px] border-neo-black bg-secondary/50 hover:bg-secondary hover:-translate-x-[1px] hover:shadow-neo-sm transition-all duration-150"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative inline-flex items-center gap-2">
                <span className="text-sm font-bold truncate" title={m.email ?? undefined}>
                  {m.email ?? `User ${m.user_id.slice(0, 8)}...`}
                </span>
                {activeUserIds.has(m.user_id) && (
                  <span
                    className="shrink-0 w-2 h-2 rounded-full bg-green-500 border-2 border-background shadow-sm animate-pulse"
                    title="Active now"
                  />
                )}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold uppercase shrink-0 ${
                  m.role === 'owner'
                    ? 'bg-neo-yellow border-[2px] border-neo-black'
                    : m.role === 'contributor'
                    ? 'bg-neo-cyan/80 border-[2px] border-neo-black'
                    : 'bg-neo-gray border-[2px] border-neo-black'
                }`}
              >
                {m.role === 'owner' ? (
                  <>Owner</>
                ) : m.role === 'contributor' ? (
                  <>
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    View-only
                  </>
                )}
              </span>
            </div>
            {isOwner && m.role !== 'owner' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    disabled={!!loading}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleChangeRole(m.id, 'contributor')}
                    disabled={loading === m.id || m.role === 'contributor'}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Set as Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleChangeRole(m.id, 'viewer')}
                    disabled={loading === m.id || m.role === 'viewer'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Set as View-only
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleRemove(m.id)}
                    disabled={loading === m.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove access
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
