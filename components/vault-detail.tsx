'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AddSourceDialog } from './add-source-dialog'
import { SourceCard } from './source-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Search, Calendar } from 'lucide-react'
import { deleteSourcesBulk } from '@/app/actions/sources'
import type { VaultRole } from '@/lib/auth/rbac'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const router = useRouter()

  const filteredAndSortedSources = useMemo(() => {
    let list = sources
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter((s) => {
        const titleMatch = s.title.toLowerCase().includes(q)
        const urlMatch = (s.url ?? '').toLowerCase().includes(q)
        const noteMatch = (s.annotations ?? []).some((a) => a.note.toLowerCase().includes(q))
        return titleMatch || urlMatch || noteMatch
      })
    }
    if (viewMode === 'timeline') {
      list = [...list].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }
    return list
  }, [sources, searchQuery, viewMode])

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openBulkDeleteConfirm() {
    if (selectedIds.size > 0) setBulkDeleteConfirmOpen(true)
  }

  async function handleConfirmBulkDelete() {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    try {
      const { error } = await deleteSourcesBulk(vaultId, Array.from(selectedIds))
      if (error) throw new Error(error)
      setBulkDeleteConfirmOpen(false)
      setSelectedIds(new Set())
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setBulkDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-black uppercase">Sources</h2>
          <div className="flex items-center gap-2 flex-wrap">
          {canEdit && selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={openBulkDeleteConfirm}
              disabled={bulkDeleting}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete selected ({selectedIds.size})
              </Button>
            )}
            {canEdit && <AddSourceDialog vaultId={vaultId} />}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by concept, title, URL or annotation…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-2 border-neo-black"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Timeline
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'timeline' && filteredAndSortedSources.length > 0 && (
        <p className="text-xs text-muted-foreground font-medium">
          Chronological order (oldest first). When sources were added to the vault.
        </p>
      )}

      {sources.length === 0 ? (
        <div className="border-[4px] border-neo-black bg-card p-12 text-center text-muted-foreground font-medium shadow-neo-md">
          <p className="mb-4">No sources yet. Add your first research source.</p>
          {canEdit && <AddSourceDialog vaultId={vaultId} />}
        </div>
      ) : filteredAndSortedSources.length === 0 ? (
        <div className="border-[4px] border-neo-black bg-card p-8 text-center text-muted-foreground font-medium shadow-neo-md">
          <p>No sources match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 stagger-children">
          {filteredAndSortedSources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              vaultId={vaultId}
              canEdit={canEdit}
              selectable={canEdit}
              selected={selectedIds.has(source.id)}
              onSelectChange={() => toggleSelect(source.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete selected sources"
        description={`Delete ${selectedIds.size} source(s) and their annotations? This cannot be undone.`}
        confirmLabel="Delete all"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleConfirmBulkDelete}
        loading={bulkDeleting}
      />
    </div>
  )
}
