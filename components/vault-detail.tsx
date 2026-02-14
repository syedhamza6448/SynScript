'use client'

import { AddSourceDialog } from './add-source-dialog'
import { SourceCard } from './source-card'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import type { VaultRole } from '@/lib/auth/rbac'

interface Annotation {
  id: string
  note: string
  user_id: string
  created_at: string
}

interface Source {
  id: string
  url: string | null
  title: string
  file_path: string | null
  created_at: string
  annotations?: Annotation[]
}

interface Member {
  id: string
  role: string
  user_id: string
}

interface VaultDetailProps {
  vaultId: string
  sources: Source[]
  role: VaultRole
  members: Member[]
}

export function VaultDetail({
  vaultId,
  sources,
  role,
  members,
}: VaultDetailProps) {
  const canEdit = role === 'owner' || role === 'contributor'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Sources</h2>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-4 w-4" />
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>
        {canEdit && <AddSourceDialog vaultId={vaultId} />}
      </div>

      {sources.length === 0 ? (
        <div className="border rounded-lg p-12 text-center text-muted-foreground">
          <p className="mb-4">No sources yet. Add your first research source.</p>
          {canEdit && <AddSourceDialog vaultId={vaultId} />}
        </div>
      ) : (
        <div className="grid gap-4">
          {sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              vaultId={vaultId}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
