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
import { Label } from '@/components/ui/label'
import { updateAnnotation } from '@/app/actions/annotations'
import { Pencil } from 'lucide-react'

export function EditAnnotationDialog({
  annotationId,
  vaultId,
  initialNote,
  pageNumber,
}: {
  annotationId: string
  vaultId: string
  initialNote: string
  pageNumber?: number
}) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(initialNote)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await updateAnnotation(annotationId, vaultId, note, pageNumber)
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
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setNote(initialNote) }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit annotation</DialogTitle>
            <DialogDescription>Update your note.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-5">
            <div className="space-y-2">
              <Label htmlFor="edit-note">Note</Label>
              <textarea
                id="edit-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex min-h-[80px] w-full border-[3px] border-neo-black bg-neo-white px-4 py-2.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan focus-visible:ring-offset-2"
                required
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
