'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteAnnotation } from '@/app/actions/annotations'
import { Trash2 } from 'lucide-react'

export function DeleteAnnotationButton({
  annotationId,
  vaultId,
}: {
  annotationId: string
  vaultId: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this annotation?')) return
    setLoading(true)
    try {
      const { error } = await deleteAnnotation(annotationId, vaultId)
      if (error) throw new Error(error)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
