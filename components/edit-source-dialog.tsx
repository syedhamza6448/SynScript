'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil } from 'lucide-react'
import { updateSource } from '@/app/actions/sources'

export function EditSourceDialog({
  vaultId,
  sourceId,
  initialTitle,
  initialUrl,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: {
  vaultId: string
  sourceId: string
  initialTitle: string
  initialUrl: string | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOnOpenChange != null
  const open = isControlled ? (controlledOpen ?? false) : internalOpen
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const [title, setTitle] = useState(initialTitle)
  const [url, setUrl] = useState(initialUrl ?? '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await updateSource(vaultId, sourceId, { title, url: url || undefined })
      if (error) throw new Error(error)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setTitle(initialTitle); setUrl(initialUrl ?? '') } }}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit source</DialogTitle>
            <DialogDescription>Update title and URL.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Source title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL (optional)</Label>
              <Input
                id="edit-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
