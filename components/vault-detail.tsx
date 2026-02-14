'use client'

import { AddSourceDialog } from './add-source-dialog'
import { SourceCard } from './source-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
        <h2 className="text-xl font-black uppercase">Sources</h2>
        {canEdit && <AddSourceDialog vaultId={vaultId} />}
      </div>

      {sources.length === 0 ? (
        <div className="border-[4px] border-neo-black bg-card p-12 text-center text-muted-foreground font-medium shadow-neo-md">
          <p className="mb-4">No sources yet. Add your first research source.</p>
          {canEdit && <AddSourceDialog vaultId={vaultId} />}
        </div>
      ) : (
        <div className="grid gap-4 stagger-children">
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
