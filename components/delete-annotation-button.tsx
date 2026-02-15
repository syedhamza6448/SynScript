'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteAnnotation } from '@/app/actions/annotations'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Trash2 } from 'lucide-react'

export function DeleteAnnotationButton({
  annotationId,
  vaultId,
}: {
  annotationId: string
  vaultId: string
}) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleConfirm() {
    setLoading(true)
    try {
      const { error } = await deleteAnnotation(annotationId, vaultId)
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
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
        onClick={() => setOpen(true)}
        disabled={loading}
        aria-label="Delete annotation"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete annotation"
        description="Delete this annotation? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  )
}
